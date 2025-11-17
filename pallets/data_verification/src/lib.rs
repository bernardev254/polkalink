#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

use frame_support::{
    pallet_prelude::*,
    BoundedVec,
};
use scale_info::prelude::vec::Vec;
use frame_system::pallet_prelude::*;
use scale_info::TypeInfo;
use codec::{Encode, Decode, MaxEncodedLen};
use partner_registry::PartnerType;

#[derive(Clone, Encode, Decode, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
}

#[derive(Clone, Encode, Decode, PartialEq, Eq, MaxEncodedLen, TypeInfo, RuntimeDebug)]
pub struct DataRecord<AccountId, BlockNumber, MaxHashLength: Get<u32>> {
    pub submitter: AccountId,
    pub data_hash: BoundedVec<u8, MaxHashLength>,
    pub status: VerificationStatus,
    pub verified_by: Option<AccountId>,
    pub submitted_at: BlockNumber,
    pub verified_at: Option<BlockNumber>,
}

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config + partner_registry::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

        /// Maximum allowed length for a data hash (e.g., IPFS CID)
        #[pallet::constant]
        type MaxHashLength: Get<u32> + TypeInfo;
    }

    #[pallet::storage]
    #[pallet::getter(fn data_records)]
    pub type DataRecords<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BoundedVec<u8, T::MaxHashLength>,
        DataRecord<T::AccountId, BlockNumberFor<T>, T::MaxHashLength>,
        OptionQuery,
    >;

    #[pallet::storage]
    #[pallet::getter(fn total_records)]
    pub type TotalRecords<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        DataSubmitted { who: T::AccountId, data_hash: Vec<u8> },
        DataVerified { verifier: T::AccountId, data_hash: Vec<u8> },
        DataRejected { verifier: T::AccountId, data_hash: Vec<u8> },
    }

    #[pallet::error]
    pub enum Error<T> {
        PartnerNotRegistered,
        NotAuthorizedCertifier,
        DataAlreadySubmitted,
        DataNotFound,
        AlreadyVerified,
        InvalidDataHash,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Submit data for verification
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn submit_data(origin: OriginFor<T>, data_hash: Vec<u8>) -> DispatchResult {
            let who = ensure_signed(origin)?;

            // Ensure partner exists
            ensure!(
                partner_registry::Partners::<T>::contains_key(&who),
                Error::<T>::PartnerNotRegistered
            );

            // Ensure bounded hash
            let bounded_hash: BoundedVec<u8, T::MaxHashLength> = data_hash
                .clone()
                .try_into()
                .map_err(|_| Error::<T>::InvalidDataHash)?;

            ensure!(
                !DataRecords::<T>::contains_key(&bounded_hash),
                Error::<T>::DataAlreadySubmitted
            );

            // Get current block number directly
            let current_block = <frame_system::Pallet<T>>::block_number();

            let record = DataRecord {
                submitter: who.clone(),
                data_hash: bounded_hash.clone(),
                status: VerificationStatus::Pending,
                verified_by: None,
                submitted_at: current_block,
                verified_at: None,
            };

            DataRecords::<T>::insert(&bounded_hash, record);
            TotalRecords::<T>::mutate(|count| *count += 1);

            Self::deposit_event(Event::DataSubmitted { who, data_hash });

            Ok(())
        }

        /// Verify submitted data (only certifiers)
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn verify_data(
            origin: OriginFor<T>,
            data_hash: Vec<u8>,
            is_valid: bool,
        ) -> DispatchResult {
            let verifier = ensure_signed(origin)?;

            let certifier = partner_registry::Partners::<T>::get(&verifier)
                .ok_or(Error::<T>::PartnerNotRegistered)?;

            ensure!(
                certifier.partner_type == PartnerType::Certifier,
                Error::<T>::NotAuthorizedCertifier
            );

            let bounded_hash: BoundedVec<u8, T::MaxHashLength> = data_hash
                .clone()
                .try_into()
                .map_err(|_| Error::<T>::InvalidDataHash)?;

            DataRecords::<T>::try_mutate(&bounded_hash, |maybe_record| -> DispatchResult {
                let record = maybe_record.as_mut().ok_or(Error::<T>::DataNotFound)?;

                ensure!(
                    matches!(record.status, VerificationStatus::Pending),
                    Error::<T>::AlreadyVerified
                );

                record.status = if is_valid {
                    VerificationStatus::Verified
                } else {
                    VerificationStatus::Rejected
                };
                record.verified_by = Some(verifier.clone());
                record.verified_at = Some(<frame_system::Pallet<T>>::block_number());

                Ok(())
            })?;

            if is_valid {
                Self::deposit_event(Event::DataVerified { verifier, data_hash });
            } else {
                Self::deposit_event(Event::DataRejected { verifier, data_hash });
            }

            Ok(())
        }
    }
}
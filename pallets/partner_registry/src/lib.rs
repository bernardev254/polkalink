#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    pallet_prelude::*,
};
use frame_system::pallet_prelude::*;
use scale_info::TypeInfo;

pub use pallet::*;

#[derive(
    Clone, Encode, Decode, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug, DecodeWithMemTracking
)]
pub enum PartnerType {
    Producer,
    Retailer,
    Certifier,
    LogisticsProvider,
    Auditor,
}

#[derive(
    Clone, Encode, Decode, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug
)]
pub struct PartnerInfo<AccountId> {
    pub account_id: AccountId,
    pub partner_type: PartnerType,
    pub is_active: bool,
}

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    #[pallet::storage]
    #[pallet::getter(fn partners)]
    pub type Partners<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        PartnerInfo<T::AccountId>,
        OptionQuery,
    >;

    #[pallet::storage]
    #[pallet::getter(fn partner_count)]
    pub type PartnerCount<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        PartnerRegistered { who: T::AccountId, partner_type: PartnerType },
        PartnerInfoUpdated { who: T::AccountId },
        PartnerDeactivated { who: T::AccountId },
    }

    #[pallet::error]
    pub enum Error<T> {
        PartnerAlreadyRegistered,
        PartnerNotFound,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_partner(
            origin: OriginFor<T>,
            partner_type: PartnerType,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            ensure!(
                !Partners::<T>::contains_key(&who),
                Error::<T>::PartnerAlreadyRegistered
            );

            let info = PartnerInfo {
                account_id: who.clone(),
                partner_type: partner_type.clone(),
                is_active: true,
            };

            Partners::<T>::insert(&who, info);
            PartnerCount::<T>::mutate(|count| *count += 1);

            Self::deposit_event(Event::PartnerRegistered { who, partner_type });
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn set_active_status(
            origin: OriginFor<T>,
            is_active: bool,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Partners::<T>::try_mutate(&who, |maybe_partner| -> DispatchResult {
                let partner = maybe_partner.as_mut().ok_or(Error::<T>::PartnerNotFound)?;
                partner.is_active = is_active;
                Ok(())
            })?;

            Self::deposit_event(Event::PartnerInfoUpdated { who });
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn deactivate_partner(origin: OriginFor<T>) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Partners::<T>::try_mutate_exists(&who, |maybe_partner| -> DispatchResult {
                let partner = maybe_partner.as_mut().ok_or(Error::<T>::PartnerNotFound)?;
                partner.is_active = false;
                Ok(())
            })?;

            Self::deposit_event(Event::PartnerDeactivated { who });
            Ok(())
        }
    }
}



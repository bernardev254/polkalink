//! Partner Registry Pallet
//! 
//! Manages consortium members, their roles, and registration status.
//! Partners can be producers, certifiers, retailers, or logistics providers.

use frame_support::{
    dispatch::{DispatchResult, DispatchError},
    pallet_prelude::*,
    traits::{Get, Randomness},
};
use frame_system::pallet_prelude::*;
use sp_std::vec::Vec;
use codec::{Encode, Decode};
use scale_info::TypeInfo;

pub use pallet::*;

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub enum PartnerType {
    Producer,
    Certifier,
    Retailer,
    LogisticsProvider,
    Auditor,
    Regulator,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub enum PartnerStatus {
    Pending,
    Active,
    Suspended,
    Revoked,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub struct PartnerInfo<AccountId, BlockNumber> {
    pub account_id: AccountId,
    pub partner_type: PartnerType,
    pub status: PartnerStatus,
    pub name: Vec<u8>,
    pub description: Vec<u8>,
    pub registration_block: BlockNumber,
    pub certifications: Vec<Vec<u8>>,
    pub reputation_score: u32,
}

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// Maximum length for partner name
        #[pallet::constant]
        type MaxNameLength: Get<u32>;
        
        /// Maximum length for partner description
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
        
        /// Maximum number of certifications per partner
        #[pallet::constant]
        type MaxCertifications: Get<u32>;
    }

    #[pallet::storage]
    #[pallet::getter(fn partners)]
    pub type Partners<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        PartnerInfo<T::AccountId, BlockNumberFor<T>>,
        OptionQuery,
    >;

    #[pallet::storage]
    #[pallet::getter(fn partner_count)]
    pub type PartnerCount<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn partners_by_type)]
    pub type PartnersByType<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        PartnerType,
        BoundedVec<T::AccountId, T::MaxCertifications>,
        ValueQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Partner registered successfully
        PartnerRegistered {
            account_id: T::AccountId,
            partner_type: PartnerType,
        },
        /// Partner status updated
        PartnerStatusUpdated {
            account_id: T::AccountId,
            old_status: PartnerStatus,
            new_status: PartnerStatus,
        },
        /// Partner certification added
        CertificationAdded {
            account_id: T::AccountId,
            certification: Vec<u8>,
        },
        /// Partner reputation updated
        ReputationUpdated {
            account_id: T::AccountId,
            old_score: u32,
            new_score: u32,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        /// Partner already registered
        PartnerAlreadyExists,
        /// Partner not found
        PartnerNotFound,
        /// Invalid partner status transition
        InvalidStatusTransition,
        /// Name too long
        NameTooLong,
        /// Description too long
        DescriptionTooLong,
        /// Too many certifications
        TooManyCertifications,
        /// Not authorized to perform this action
        NotAuthorized,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Register a new partner in the network
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_partner(
            origin: OriginFor<T>,
            partner_type: PartnerType,
            name: Vec<u8>,
            description: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            ensure!(!Partners::<T>::contains_key(&who), Error::<T>::PartnerAlreadyExists);
            ensure!(name.len() <= T::MaxNameLength::get() as usize, Error::<T>::NameTooLong);
            ensure!(description.len() <= T::MaxDescriptionLength::get() as usize, Error::<T>::DescriptionTooLong);

            let current_block = <frame_system::Pallet<T>>::block_number();
            
            let partner_info = PartnerInfo {
                account_id: who.clone(),
                partner_type: partner_type.clone(),
                status: PartnerStatus::Pending,
                name,
                description,
                registration_block: current_block,
                certifications: Vec::new(),
                reputation_score: 100, // Starting reputation
            };

            Partners::<T>::insert(&who, &partner_info);
            PartnerCount::<T>::mutate(|count| *count += 1);

            // Add to type-based index
            PartnersByType::<T>::try_mutate(&partner_type, |partners| {
                partners.try_push(who.clone())
            }).map_err(|_| Error::<T>::TooManyCertifications)?;

            Self::deposit_event(Event::PartnerRegistered {
                account_id: who,
                partner_type,
            });

            Ok(())
        }

        /// Update partner status (admin only)
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn update_partner_status(
            origin: OriginFor<T>,
            partner_id: T::AccountId,
            new_status: PartnerStatus,
        ) -> DispatchResult {
            ensure_root(origin)?;

            Partners::<T>::try_mutate(&partner_id, |partner_opt| {
                let partner = partner_opt.as_mut().ok_or(Error::<T>::PartnerNotFound)?;
                let old_status = partner.status.clone();
                
                // Validate status transition
                match (&old_status, &new_status) {
                    (PartnerStatus::Pending, PartnerStatus::Active) => {},
                    (PartnerStatus::Active, PartnerStatus::Suspended) => {},
                    (PartnerStatus::Suspended, PartnerStatus::Active) => {},
                    (_, PartnerStatus::Revoked) => {},
                    _ => return Err(Error::<T>::InvalidStatusTransition.into()),
                }

                partner.status = new_status.clone();

                Self::deposit_event(Event::PartnerStatusUpdated {
                    account_id: partner_id.clone(),
                    old_status,
                    new_status,
                });

                Ok(())
            })
        }

        /// Add certification to partner
        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn add_certification(
            origin: OriginFor<T>,
            certification: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Partners::<T>::try_mutate(&who, |partner_opt| {
                let partner = partner_opt.as_mut().ok_or(Error::<T>::PartnerNotFound)?;
                
                ensure!(
                    partner.certifications.len() < T::MaxCertifications::get() as usize,
                    Error::<T>::TooManyCertifications
                );

                partner.certifications.push(certification.clone());

                Self::deposit_event(Event::CertificationAdded {
                    account_id: who.clone(),
                    certification,
                });

                Ok(())
            })
        }

        /// Update partner reputation (called by other pallets)
        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn update_reputation(
            origin: OriginFor<T>,
            partner_id: T::AccountId,
            score_delta: i32,
        ) -> DispatchResult {
            ensure_root(origin)?;

            Partners::<T>::try_mutate(&partner_id, |partner_opt| {
                let partner = partner_opt.as_mut().ok_or(Error::<T>::PartnerNotFound)?;
                let old_score = partner.reputation_score;
                
                // Apply score change with bounds checking
                if score_delta >= 0 {
                    partner.reputation_score = partner.reputation_score.saturating_add(score_delta as u32);
                } else {
                    partner.reputation_score = partner.reputation_score.saturating_sub((-score_delta) as u32);
                }

                // Cap reputation at 1000
                partner.reputation_score = partner.reputation_score.min(1000);

                Self::deposit_event(Event::ReputationUpdated {
                    account_id: partner_id.clone(),
                    old_score,
                    new_score: partner.reputation_score,
                });

                Ok(())
            })
        }
    }

    impl<T: Config> Pallet<T> {
        /// Check if account is a registered active partner
        pub fn is_active_partner(account_id: &T::AccountId) -> bool {
            Partners::<T>::get(account_id)
                .map(|partner| partner.status == PartnerStatus::Active)
                .unwrap_or(false)
        }

        /// Get partner type for account
        pub fn get_partner_type(account_id: &T::AccountId) -> Option<PartnerType> {
            Partners::<T>::get(account_id).map(|partner| partner.partner_type)
        }

        /// Check if partner has specific type
        pub fn is_partner_type(account_id: &T::AccountId, partner_type: &PartnerType) -> bool {
            Self::get_partner_type(account_id)
                .map(|pt| &pt == partner_type)
                .unwrap_or(false)
        }
    }
}

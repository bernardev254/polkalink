#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    dispatch::{DispatchResult, DispatchError},
    pallet_prelude::*,
    traits::{Get, Randomness},
};
use frame_system::pallet_prelude::*;
use sp_std::{vec::Vec, collections::btree_map::BTreeMap};
use codec::{Encode, Decode};
use scale_info::TypeInfo;

pub use pallet::*;

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub enum PartnerType {
    Producer,
    Retailer,
    Certifier,
    LogisticsProvider,
    Auditor,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub struct PartnerInfo<AccountId> {
    pub account_id: AccountId,
    pub partner_type: PartnerType,
    pub name: Vec<u8>,
    pub description: Vec<u8>,
    pub certifications: Vec<Vec<u8>>,
    pub is_active: bool,
    pub reputation_score: u32,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
pub struct AccessPermission {
    pub data_type: Vec<u8>,
    pub read_access: bool,
    pub write_access: bool,
    pub expiry_block: Option<u32>,
}

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// Maximum length for partner names
        #[pallet::constant]
        type MaxNameLength: Get<u32>;
        
        /// Maximum length for partner descriptions
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
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
    #[pallet::getter(fn partner_permissions)]
    pub type PartnerPermissions<T: Config> = StorageDoubleMap<
        _,
        Blake2_128Concat,
        T::AccountId, // Grantor
        Blake2_128Concat,
        T::AccountId, // Grantee
        Vec<AccessPermission>,
        ValueQuery,
    >;

    #[pallet::storage]
    #[pallet::getter(fn partner_count)]
    pub type PartnerCount<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Partner registered successfully
        PartnerRegistered { who: T::AccountId, partner_type: PartnerType },
        /// Partner information updated
        PartnerUpdated { who: T::AccountId },
        /// Partner deactivated
        PartnerDeactivated { who: T::AccountId },
        /// Access permission granted
        PermissionGranted { grantor: T::AccountId, grantee: T::AccountId },
        /// Access permission revoked
        PermissionRevoked { grantor: T::AccountId, grantee: T::AccountId },
    }

    #[pallet::error]
    pub enum Error<T> {
        /// Partner already registered
        PartnerAlreadyExists,
        /// Partner not found
        PartnerNotFound,
        /// Name too long
        NameTooLong,
        /// Description too long
        DescriptionTooLong,
        /// Not authorized to perform this action
        NotAuthorized,
        /// Invalid partner type
        InvalidPartnerType,
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

            // Ensure partner doesn't already exist
            ensure!(!Partners::<T>::contains_key(&who), Error::<T>::PartnerAlreadyExists);

            // Validate input lengths
            ensure!(name.len() <= T::MaxNameLength::get() as usize, Error::<T>::NameTooLong);
            ensure!(description.len() <= T::MaxDescriptionLength::get() as usize, Error::<T>::DescriptionTooLong);

            let partner_info = PartnerInfo {
                account_id: who.clone(),
                partner_type: partner_type.clone(),
                name,
                description,
                certifications: Vec::new(),
                is_active: true,
                reputation_score: 100, // Starting reputation
            };

            Partners::<T>::insert(&who, partner_info);
            PartnerCount::<T>::mutate(|count| *count += 1);

            Self::deposit_event(Event::PartnerRegistered { who, partner_type });
            Ok(())
        }

        /// Update partner information
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn update_partner(
            origin: OriginFor<T>,
            name: Option<Vec<u8>>,
            description: Option<Vec<u8>>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Partners::<T>::try_mutate(&who, |partner_opt| -> DispatchResult {
                let partner = partner_opt.as_mut().ok_or(Error::<T>::PartnerNotFound)?;

                if let Some(new_name) = name {
                    ensure!(new_name.len() <= T::MaxNameLength::get() as usize, Error::<T>::NameTooLong);
                    partner.name = new_name;
                }

                if let Some(new_description) = description {
                    ensure!(new_description.len() <= T::MaxDescriptionLength::get() as usize, Error::<T>::DescriptionTooLong);
                    partner.description = new_description;
                }

                Ok(())
            })?;

            Self::deposit_event(Event::PartnerUpdated { who });
            Ok(())
        }

        /// Grant data access permission to another partner
        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn grant_permission(
            origin: OriginFor<T>,
            grantee: T::AccountId,
            data_type: Vec<u8>,
            read_access: bool,
            write_access: bool,
            expiry_block: Option<u32>,
        ) -> DispatchResult {
            let grantor = ensure_signed(origin)?;

            // Ensure both parties are registered partners
            ensure!(Partners::<T>::contains_key(&grantor), Error::<T>::PartnerNotFound);
            ensure!(Partners::<T>::contains_key(&grantee), Error::<T>::PartnerNotFound);

            let permission = AccessPermission {
                data_type,
                read_access,
                write_access,
                expiry_block,
            };

            PartnerPermissions::<T>::mutate(&grantor, &grantee, |permissions| {
                permissions.push(permission);
            });

            Self::deposit_event(Event::PermissionGranted { grantor, grantee });
            Ok(())
        }

        /// Revoke data access permission
        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn revoke_permission(
            origin: OriginFor<T>,
            grantee: T::AccountId,
            data_type: Vec<u8>,
        ) -> DispatchResult {
            let grantor = ensure_signed(origin)?;

            PartnerPermissions::<T>::mutate(&grantor, &grantee, |permissions| {
                permissions.retain(|p| p.data_type != data_type);
            });

            Self::deposit_event(Event::PermissionRevoked { grantor, grantee });
            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        /// Check if an account has permission to access specific data
        pub fn has_permission(
            grantor: &T::AccountId,
            grantee: &T::AccountId,
            data_type: &[u8],
            write_access: bool,
        ) -> bool {
            let permissions = Self::partner_permissions(grantor, grantee);
            
            permissions.iter().any(|p| {
                p.data_type == data_type &&
                (if write_access { p.write_access } else { p.read_access }) &&
                p.expiry_block.map_or(true, |expiry| {
                    frame_system::Pallet::<T>::block_number() < expiry.into()
                })
            })
        }
    }
}
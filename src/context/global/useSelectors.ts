'use client';

import { useSyncExternalStore } from 'react';

import { TProductType } from '@/types/productType';

import { useEntityContext } from './useContext';

export function useProductTypesSelector(): TProductType[] | undefined {
	const { getProductTypes, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getProductTypes, getProductTypes);
}

export function useEntitiesTotalSelector(): number | undefined {
	const { getEntitiesTotal, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getEntitiesTotal, getEntitiesTotal);
}

export function useAvatarProfileSelector(): string | undefined {
	const { getAvatarProfile, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getAvatarProfile, getAvatarProfile);
}

export function useEntitiesTitleSelector(): string | undefined {
	const { getEntitiesTitle, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getEntitiesTitle, getEntitiesTitle);
}

export function useLinkAddEntitySelector(): string | undefined {
	const { getLinkAddEntity, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getLinkAddEntity, getLinkAddEntity);
}

export const useSetAvatarProfileDispatch = () => {
	return useEntityContext().setAvatarProfile;
};

export const useSetLinkAddEntityDispatch = () => {
	return useEntityContext().setLinkAddEntity;
};

export const useEntitiesTitleDispatch = () => {
	return useEntityContext().setEntitiesTitle;
};

export const useSetEntitiesTotalDispatch = () => {
	return useEntityContext().setEntitiesTotal;
};

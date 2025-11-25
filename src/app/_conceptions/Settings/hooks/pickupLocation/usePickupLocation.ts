import { useMemo } from 'react';

import { formatLocationLabel, toLocationFormValue } from '@/utils/map';

import {
	useListSelector,
	useSetAllDispatch
} from '../../context/pickupLocation/useSelectors';

import type { TPickupLocationReturn } from './types';
import { usePickupLocationActions } from './usePickupLocationActions';
import { usePickupLocationState } from './usePickupLocationState';

export const usePickupLocation = (): TPickupLocationReturn => {
	const { state, handlers } = usePickupLocationState();
	const rawItems = useListSelector();
	const setAll = useSetAllDispatch();

	const items = useMemo(
		() =>
			rawItems.map(entity => {
				const location = toLocationFormValue(entity);
				return {
					id: entity.id,
					location,
					label: formatLocationLabel(location),
					entity
				};
			}),
		[rawItems]
	);

	const actions = usePickupLocationActions({
		state,
		handlers,
		rawItems,
		setAll
	});

	return useMemo(
		() => ({
			...state,
			...actions,
			items
		}),
		[state, actions, items]
	);
};

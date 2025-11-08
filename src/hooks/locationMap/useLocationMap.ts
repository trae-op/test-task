import { useMemo } from 'react';

import type { TLocationMapHookReturn, TUseLocationMapParams } from './types';
import { useLocationMapActions } from './useLocationMapActions';
import { useLocationMapState } from './useLocationMapState';

export const useLocationMap = (
	params: TUseLocationMapParams = {}
): TLocationMapHookReturn => {
	const { state, handlers } = useLocationMapState(params.initialLocation);
	const actions = useLocationMapActions({
		state,
		handlers,
		onSuccessfulLocation: params.onSuccessfulLocation
	});

	return useMemo(
		() => ({
			...state,
			...actions
		}),
		[state, actions]
	);
};

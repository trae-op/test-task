import { useMemo, useState } from 'react';

import type { TLocationFormValue } from '@/types/location';

import type {
	TPickupLocationErrorCode,
	TPickupLocationState,
	TPickupLocationStateHandlers,
	TPickupLocationStateReturn
} from './types';

export const usePickupLocationState = (): TPickupLocationStateReturn => {
	const [pendingLocation, setPendingLocationState] = useState<
		TLocationFormValue | undefined
	>(undefined);
	const [isSubmitting, setIsSubmittingState] = useState<boolean>(false);
	const [errorCode, setErrorCodeState] = useState<
		TPickupLocationErrorCode | undefined
	>(undefined);

	const state: TPickupLocationState = useMemo(
		() => ({ pendingLocation, isSubmitting, errorCode }),
		[pendingLocation, isSubmitting, errorCode]
	);

	const handlers: TPickupLocationStateHandlers = useMemo(
		() => ({
			setPendingLocation: setPendingLocationState,
			setIsSubmitting: setIsSubmittingState,
			setErrorCode: setErrorCodeState
		}),
		[]
	);

	return useMemo(() => ({ state, handlers }), [state, handlers]);
};

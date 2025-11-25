import { useContext } from 'react';

import { Context } from './Context';

export const useEntityContext = () => {
	const ctx = useContext(Context);
	if (!ctx)
		throw new Error(
			'PickupLocation useEntityContext must be used within a Provider'
		);
	return ctx;
};

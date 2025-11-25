import { useContext } from 'react';

import { Context } from './Context';

export const useActiveSessionsContext = () => {
	const ctx = useContext(Context);

	if (!ctx) {
		throw new Error(
			'useActiveSessionsContext must be used within ActiveSessions Provider'
		);
	}

	return ctx;
};

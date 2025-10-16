import { useMemo, useState } from 'react';

import type { TUseConfirmPopup } from './types';

export const useConfirmPopup = (): TUseConfirmPopup => {
	const [isOpen, setIsOpen] = useState(false);
	const [entityId, setEntityId] = useState<string | undefined>(undefined);

	const actions = useMemo(
		() => ({
			handleOpen: (id?: string) => {
				setEntityId(id);
				setIsOpen(true);
			},
			handleClose: () => {
				setIsOpen(false);
				setEntityId(undefined);
			}
		}),
		[]
	);

	return { isOpen, entityId, ...actions };
};

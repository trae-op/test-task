'use client';

import { useEffect } from 'react';

export const useAddProductApplyBinding = (
	submitViaApply: (onClose: () => void) => void
) => {
	useEffect(() => {
		const handler = (ev: Event) => {
			const ce = ev as CustomEvent<{ onClose: () => void }>;
			const onClose = ce.detail?.onClose ?? (() => {});
			submitViaApply(onClose);
		};
		window.addEventListener('add-product-apply', handler as EventListener);
		return () =>
			window.removeEventListener('add-product-apply', handler as EventListener);
	}, [submitViaApply]);
};

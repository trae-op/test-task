import { useState } from 'react';
import toast, { type ToastOptions, type ToastType } from 'react-hot-toast';

import { TControlToasterHook } from './types';

export const useActions = (): TControlToasterHook => {
	const [options, setOptions] = useState<ToastOptions>();
	const setToast = (message: string, type?: ToastType) => {
		switch (type) {
			case 'error': {
				toast.error(message, options);
				break;
			}
			default: {
				toast.success(message, options);
			}
		}
	};

	return {
		setOptions,
		setToast
	};
};

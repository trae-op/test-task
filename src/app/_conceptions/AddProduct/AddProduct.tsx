'use client';

import { useTranslations } from 'next-intl';

import { AddEntityButton } from '@/components/ui/AddEntityButton';
import { Popup } from '@/components/ui/Popup';

export const AddProduct = () => {
	const tp = useTranslations('App.products');

	return (
		<div className='d-flex align-items-center justify-content-start'>
			<Popup
				componentButton={AddEntityButton}
				openButtonAriaLabel={tp('Add Product')}
				title={tp('Add Product')}
				applyText='Add'
				onApply={onClose => {
					console.log('add product');
					onClose();
				}}
			/>
			<span className='ms-2'>{tp('Add Product')}</span>
		</div>
	);
};

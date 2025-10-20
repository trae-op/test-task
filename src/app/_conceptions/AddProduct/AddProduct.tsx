'use client';

import { useTranslations } from 'next-intl';

import { AddProductForm } from '@/components/AddProduct';
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
					// Fire a custom event consumed by AddProductForm to submit and close
					window.dispatchEvent(
						new CustomEvent('add-product-apply', { detail: { onClose } })
					);
				}}
			>
				<AddProductForm />
			</Popup>
			<span className='ms-2'>{tp('Add Product')}</span>
		</div>
	);
};

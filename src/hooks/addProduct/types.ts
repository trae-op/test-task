import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { MultiValue } from 'react-select';

export type TPriceOption = {
	value: number;
	label: 'USD' | 'UAH';
	isDefault?: 0 | 1;
};
export type TSelectOption = { value: string; label: string };

export type TAddProductFormData = {
	title: string;
	type: string;
	specification?: string;
	guaranteeStart: string; // yyyy-mm-dd
	guaranteeEnd: string; // yyyy-mm-dd
	'price.value'?: string; // we store as string for inputs
	'price.symbol'?: string;
};

export type TAddProductState = {
	priceOptions: TPriceOption[];
	typeOptions: TSelectOption[];
	orderOptions: TSelectOption[];
	selectedOrders: MultiValue<TSelectOption>;
	selectedPrice?: TPriceOption;
};

export type TAddProductActions = {
	register: UseFormRegister<TAddProductFormData>;
	errors: FieldErrors<TAddProductFormData>;
	isSubmitting: boolean;
	addProductIsPending: boolean;
	handlePriceSelect: (value: string | number) => void;
	handleOrdersChange: (opts: MultiValue<TSelectOption>) => void;
	submitViaApply: (onClose: () => void) => void;
};

export type TUseAddProduct = TAddProductState & TAddProductActions;

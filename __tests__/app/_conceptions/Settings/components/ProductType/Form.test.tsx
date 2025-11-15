import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormProductType } from '@/app/_conceptions/Settings/components/ProductType/Form';
import { useActions } from '@/app/_conceptions/Settings/hooks/productType';
import type {
	TActions,
	TSettingsProductTypeFormData
} from '@/app/_conceptions/Settings/hooks/productType/types';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('@/app/_conceptions/Settings/components/ProductType/List', () => ({
	ProductTypeList: () => <div data-testid='settings-product-type-list-mock' />
}));

jest.mock('@/app/_conceptions/Settings/hooks/productType', () => ({
	useActions: jest.fn()
}));

describe('FormProductType', () => {
	let mockActions: TActions;

	const renderWithProvider = () => {
		const Wrapper = ({ children }: { children: ReactNode }) => {
			const methods = useForm<TSettingsProductTypeFormData>({
				mode: 'onBlur'
			});
			return <FormProvider {...methods}>{children}</FormProvider>;
		};

		render(
			<Wrapper>
				<FormProductType />
			</Wrapper>
		);
	};

	beforeEach(() => {
		mockActions = {
			onSubmit: jest.fn(),
			deleteEntity: jest.fn(),
			state: { ok: false }
		};
		(useActions as jest.Mock).mockReturnValue(mockActions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('submits lowercase value successfully', async () => {
			const user = userEvent.setup();
			renderWithProvider();

			await user.type(screen.getByLabelText('Title'), 'Gadget');
			await user.type(screen.getByLabelText('Value'), 'gadget');

			const form = screen.getByTestId('settings-product-type-form');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(mockActions.onSubmit).toHaveBeenCalledWith({
				title: 'Gadget',
				value: 'gadget'
			});
		});
	});

	describe('negative cases', () => {
		test('prevents submit when fields empty', async () => {
			renderWithProvider();
			const form = screen.getByTestId('settings-product-type-form');

			await act(async () => {
				fireEvent.submit(form);
			});

			expect(
				screen.getByTestId('settings-product-type-error-title')
			).toHaveTextContent('This field is required');
		});
	});

	describe('edge cases', () => {
		test('shows lowercase error when value has uppercase letters', async () => {
			const user = userEvent.setup();
			renderWithProvider();

			await user.type(screen.getByLabelText('Title'), 'Accessory');
			await user.type(screen.getByLabelText('Value'), 'Accessory');

			const form = screen.getByTestId('settings-product-type-form');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(
				screen.getByTestId('settings-product-type-error-value')
			).toHaveTextContent('Value must contain only lowercase Latin letters');
		});
	});
});

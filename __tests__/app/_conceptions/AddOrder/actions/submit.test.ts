import { redirect } from 'next/navigation';

import { addOrder } from '@/app/_conceptions/AddOrder/actions/action';
import { addOrderSubmit } from '@/app/_conceptions/AddOrder/actions/submit';

jest.mock('next/navigation', () => ({
	redirect: jest.fn()
}));

jest.mock('@/app/_conceptions/AddOrder/actions/action', () => ({
	addOrder: jest.fn()
}));

const createFormData = (values: Record<string, string>) => {
	const fd = new FormData();
	Object.entries(values).forEach(([key, value]) => fd.append(key, value));
	return fd;
};

describe('addOrderSubmit server action', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('redirects to locale orders page on success', async () => {
		(addOrder as jest.Mock).mockResolvedValueOnce({ ok: true, id: 'order-1' });

		const formData = createFormData({
			title: 'Order',
			description: 'Test',
			products: JSON.stringify(['p1']),
			locale: 'en'
		});

		await addOrderSubmit({ ok: false }, formData);

		expect(redirect).toHaveBeenCalledWith('/en/orders');
	});

	test('maps known error codes to i18n keys', async () => {
		(addOrder as jest.Mock).mockResolvedValueOnce({
			ok: false,
			code: 'INVALID_INPUT'
		});

		const result = await addOrderSubmit(
			{ ok: false },
			createFormData({
				title: 'Order',
				products: JSON.stringify(['p1'])
			})
		);

		expect(result).toEqual({ ok: false, message: 'invalidInput' });
	});

	test('passes normalized payload to addOrder and handles unknown errors', async () => {
		(addOrder as jest.Mock).mockResolvedValueOnce({
			ok: false,
			code: 'UNKNOWN'
		});

		const formData = createFormData({
			title: ' Order ',
			description: '',
			products: 'invalid-json'
		});

		const result = await addOrderSubmit({ ok: false }, formData);

		expect(addOrder).toHaveBeenCalledWith({
			title: ' Order ',
			description: null,
			products: []
		});
		expect(result).toEqual({ ok: false, message: 'default' });
	});
});

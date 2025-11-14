import { addCurrencySubmit } from '@/app/_conceptions/Settings/actions/currency/submit';

jest.mock('@/actions/settings/currency/action', () => ({
	addCurrency: jest.fn()
}));

const { addCurrency } = jest.requireMock('@/actions/settings/currency/action');

describe('addCurrencySubmit', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return success when action resolves with item', async () => {
		(addCurrency as jest.Mock).mockResolvedValue({
			ok: true,
			item: { id: 'currency-1', title: 'USD', value: 'usd' }
		});
		const formData = new FormData();
		formData.set('title', 'USD');
		formData.set('value', 'usd');

		const res = await addCurrencySubmit({ ok: false }, formData);

		expect(addCurrency).toHaveBeenCalledWith({ title: 'USD', value: 'usd' });
		expect(res).toEqual({
			ok: true,
			item: { id: 'currency-1', title: 'USD', value: 'usd' }
		});
	});

	it('should map invalid input code to invalidInput message', async () => {
		(addCurrency as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'INVALID_INPUT'
		});
		const formData = new FormData();
		formData.set('title', '');
		formData.set('value', '');

		const res = await addCurrencySubmit({ ok: false }, formData);

		expect(res).toEqual({ ok: false, message: 'invalidInput' });
	});

	it('should fall back to default message for unknown codes', async () => {
		(addCurrency as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'SOMETHING_UNEXPECTED'
		});
		const formData = new FormData();
		formData.set('title', 'USD');
		formData.set('value', 'usd');

		const res = await addCurrencySubmit({ ok: false }, formData);

		expect(res).toEqual({ ok: false, message: 'default' });
	});
});

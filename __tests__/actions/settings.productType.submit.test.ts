import { addProductTypeSubmit } from '@/app/_conceptions/Settings/actions/productType/submit';

jest.mock('@/actions/settings/productType/action', () => ({
	addProductType: jest.fn()
}));

const { addProductType } = jest.requireMock(
	'@/actions/settings/productType/action'
);

describe('addProductTypeSubmit', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return success when action resolves with item', async () => {
		(addProductType as jest.Mock).mockResolvedValue({
			ok: true,
			item: { id: 'type-1', title: 'Type', value: 'type' }
		});
		const formData = new FormData();
		formData.set('title', 'Type');
		formData.set('value', 'type');

		const res = await addProductTypeSubmit({ ok: false }, formData);

		expect(addProductType).toHaveBeenCalledWith({
			title: 'Type',
			value: 'type'
		});
		expect(res).toEqual({
			ok: true,
			item: { id: 'type-1', title: 'Type', value: 'type' }
		});
	});

	it('should map invalid input code to invalidInput message', async () => {
		(addProductType as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'INVALID_INPUT'
		});
		const formData = new FormData();
		formData.set('title', '');
		formData.set('value', '');

		const res = await addProductTypeSubmit({ ok: false }, formData);

		expect(res).toEqual({ ok: false, message: 'invalidInput' });
	});

	it('should fall back to default message for unknown codes', async () => {
		(addProductType as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'SOMETHING_UNEXPECTED'
		});
		const formData = new FormData();
		formData.set('title', 'Type');
		formData.set('value', 'type');

		const res = await addProductTypeSubmit({ ok: false }, formData);

		expect(res).toEqual({ ok: false, message: 'default' });
	});
});

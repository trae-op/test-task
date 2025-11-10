import { passwordSubmit } from '@/actions/profile/passwordSubmit';
import { profileSubmit } from '@/actions/profile/profileSubmit';

const redirectMock = jest.fn();

jest.mock('@/actions/profile/profile', () => ({ updateProfile: jest.fn() }));
jest.mock('@/actions/profile/password', () => ({ updatePassword: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: redirectMock }));
jest.mock('@/utils/routing/routing', () => ({ getProfileHref: '/profile' }));

const { updateProfile } = jest.requireMock('@/actions/profile/profile');
const { updatePassword } = jest.requireMock('@/actions/profile/password');
const redirect = redirectMock;

describe('profile submit actions', () => {
	beforeEach(() => jest.clearAllMocks());

	it('profileSubmit maps SUCCESS to ok:true and message (positive)', async () => {
		(updateProfile as jest.Mock).mockResolvedValue({
			ok: true,
			code: 'SUCCESS'
		});
		const fd = new FormData();
		fd.set('name', 'John');
		fd.set('email', 'a@b.com');
		const res = await profileSubmit({ ok: false }, fd);
		expect(res).toEqual({ ok: true, message: 'profileUpdated' });
	});

	it('profileSubmit maps INVALID_INPUT to invalidInput (negative)', async () => {
		(updateProfile as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'INVALID_INPUT'
		});
		const fd = new FormData();
		fd.set('name', '');
		fd.set('email', 'bad');
		const res = await profileSubmit({ ok: false }, fd);
		expect(res).toEqual({ ok: false, message: 'invalidInput' });
	});

	it('passwordSubmit redirects on success (positive)', async () => {
		(updatePassword as jest.Mock).mockResolvedValue({ ok: true });
		const fd = new FormData();
		fd.set('oldPassword', 'Old!23456');
		fd.set('newPassword', 'New!23456');
		fd.set('locale', 'en');
		await passwordSubmit({ ok: false }, fd);
		expect(redirect).toHaveBeenCalledWith('/en/profile');
	});

	it('passwordSubmit returns mapped message on failure (negative)', async () => {
		(updatePassword as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'WRONG_PASSWORD'
		});
		const fd = new FormData();
		fd.set('oldPassword', 'x');
		fd.set('newPassword', 'New!23456');
		fd.set('locale', 'en');
		const res = await passwordSubmit({ ok: false }, fd);
		expect(res).toEqual({ ok: false, message: 'wrongPassword' });
	});
});

import {
	isValidEmail,
	isValidName,
	isValidPassword,
	validationMessages
} from '@/utils/regExp';

describe('utils/regExp', () => {
	it('validates email success and failure', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
		expect(isValidEmail('bad-email')).toBe(false);
	});

	it('validates password success and failure', () => {
		expect(isValidPassword('abc12345')).toBe(true);
		expect(isValidPassword('abcdefg')).toBe(false);
	});

	it('validates name success and failure', () => {
		expect(isValidName('John Doe')).toBe(true);
		expect(isValidName('x')).toBe(false);
	});

	it('exposes validation messages', () => {
		expect(validationMessages.required).toBeDefined();
	});
});

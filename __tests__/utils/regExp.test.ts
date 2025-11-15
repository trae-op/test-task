import {
	EMAIL_PATTERN,
	LOWERCASE_VALUE_PATTERN,
	NAME_PATTERN,
	PASSWORD_PATTERN,
	UPPERCASE_VALUE_PATTERN,
	isValidEmail,
	isValidName,
	isValidPassword,
	isValidUuid,
	validationMessages,
	validationMessagesExtended
} from '@/utils/regExp';

describe('regExp utils', () => {
	test('email pattern and validator', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
		expect(isValidEmail('invalid-email')).toBe(false);
		expect('user@example.com').toMatch(EMAIL_PATTERN);
		expect('invalid-email').not.toMatch(EMAIL_PATTERN);
	});

	test('password pattern and validator', () => {
		expect(isValidPassword('Password1')).toBe(true);
		expect(isValidPassword('short1')).toBe(false);
		expect('Password1').toMatch(PASSWORD_PATTERN);
	});

	test('name pattern and validator', () => {
		expect(isValidName('John Doe')).toBe(true);
		expect(isValidName('J')).toBe(false);
		expect('John Doe').toMatch(NAME_PATTERN);
	});

	test('uuid validator', () => {
		expect(isValidUuid()).toBe(true);
		expect(isValidUuid(null)).toBe(true);
		expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
		expect(isValidUuid('not-a-uuid')).toBe(false);
	});

	test('extended patterns and messages exports', () => {
		expect('abc').toMatch(LOWERCASE_VALUE_PATTERN);
		expect('ABC').toMatch(UPPERCASE_VALUE_PATTERN);
		expect(validationMessages.required).toBeDefined();
		expect(validationMessagesExtended.valueLowercase).toBeDefined();
	});
});

export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const NAME_PATTERN = /^[A-Za-z\s]{2,30}$/;

export const isValidEmail = (email: string): boolean =>
	EMAIL_PATTERN.test(email);
export const isValidPassword = (password: string): boolean =>
	PASSWORD_PATTERN.test(password);
export const isValidName = (name: string): boolean => NAME_PATTERN.test(name);

export const validationMessages = {
	required: 'This field is required',
	email: 'Please enter a valid email address',
	password:
		'Password must be at least 8 characters and contain at least one letter and one number',
	name: 'Name must be between 2 and 30 characters and contain only letters',
	passwordMatch: 'Passwords must match'
};

export const LOWERCASE_VALUE_PATTERN = /^[a-z]+$/;
export const UPPERCASE_VALUE_PATTERN = /^[A-Z]+$/;

export const validationMessagesExtended = {
	valueLowercase: 'Value must contain only lowercase Latin letters',
	valueUppercase: 'Value must contain only uppercase Latin letters'
};

export const isValidUuid = (v?: string | null) =>
	!v || /^[0-9a-fA-F-]{36}$/.test(v);

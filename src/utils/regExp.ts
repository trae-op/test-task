export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const isValidEmail = (email: string): boolean =>
  EMAIL_PATTERN.test(email);
export const isValidPassword = (password: string): boolean =>
  PASSWORD_PATTERN.test(password);

export const validationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  password:
    "Password must be at least 8 characters and contain at least one letter and one number",
};

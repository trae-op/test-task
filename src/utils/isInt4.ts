export const isInt4 = (value: unknown): boolean => {
	const INT4_MIN = -2147483648;
	const INT4_MAX = 2147483647;
	return (
		typeof value === 'number' &&
		Number.isInteger(value) &&
		value >= INT4_MIN &&
		value <= INT4_MAX
	);
};

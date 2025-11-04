import '@testing-library/jest-dom';

// Silence noisy React act() warnings in test output while we progressively fix tests.
// These do not affect pass/fail but clutter the terminal.
const originalError = console.error;
console.error = (...args: unknown[]) => {
	const [first] = args;
	if (typeof first === 'string' && first.includes('not wrapped in act(')) {
		return; // ignore React act warnings
	}
	originalError(...(args as Parameters<typeof originalError>));
};

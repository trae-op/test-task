import '@testing-library/jest-dom';

// Filter noisy act warnings from Next dynamic loadable and react-hot-toast internals.
// These are benign in our tests and originate from framework internals rather than our code.
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
	try {
		const combined = args
			.map(a => (typeof a === 'string' ? a : (a?.message ?? '')))
			.join(' ');
		if (combined.includes('not wrapped in act(...)')) {
			return; // swallow benign act warnings to keep test output clean
		}
	} catch {
		// fall through to original logger if inspection fails
	}
	originalConsoleError(...(args as Parameters<typeof console.error>));
};

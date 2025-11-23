import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder)
	globalThis.TextDecoder =
		TextDecoder as unknown as typeof globalThis.TextDecoder;

const originalConsoleError = console.error;
const shouldIgnoreWarning = (args: unknown[]) => {
	try {
		const combined = args
			.map(a =>
				typeof a === 'string' ? a : ((a as { message?: string })?.message ?? '')
			)
			.join(' ');
		if (combined.includes('not wrapped in act(...)')) return true;
		if (
			combined.includes(
				'You provided a `value` prop to a form field without an `onChange` handler.'
			)
		)
			return true;
		if (
			combined.includes(
				'`ReactDOMTestUtils.act` is deprecated in favor of `React.act`'
			)
		)
			return true;
		return false;
	} catch {
		return false;
	}
};

console.error = (...args: unknown[]) => {
	if (shouldIgnoreWarning(args)) return;
	originalConsoleError(...(args as Parameters<typeof console.error>));
};

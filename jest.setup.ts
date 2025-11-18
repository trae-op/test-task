import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder)
	globalThis.TextDecoder =
		TextDecoder as unknown as typeof globalThis.TextDecoder;

const originalConsoleError = console.error;
const shouldIgnoreActWarning = (args: unknown[]) => {
	try {
		const combined = args
			.map(a =>
				typeof a === 'string' ? a : ((a as { message?: string })?.message ?? '')
			)
			.join(' ');
		return combined.includes('not wrapped in act(...)');
	} catch {
		return false;
	}
};

console.error = (...args: unknown[]) => {
	if (shouldIgnoreActWarning(args)) return;
	originalConsoleError(...(args as Parameters<typeof console.error>));
};

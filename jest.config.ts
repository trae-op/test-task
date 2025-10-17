import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	dir: './'
});

const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	modulePathIgnorePatterns: ['<rootDir>/__tests__/__mocks__'],
	moduleNameMapper: {
		'^@/i18n/navigation$': '<rootDir>/__mocks__/i18n-navigation.ts',
		'^next-intl$': '<rootDir>/__mocks__/next-intl.ts',
		'^next-intl/routing$': '<rootDir>/__mocks__/next-intl-routing.ts',
		'^next-intl/navigation$': '<rootDir>/__mocks__/next-intl-navigation.ts',
		'^next/navigation$': '<rootDir>/__mocks__/next-navigation.ts',
		'^@/(.*)$': '<rootDir>/src/$1'
	}
};

export default createJestConfig(config);

import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts'
		]
	},
	// Relax some strict rules for test files to reduce noise and allow testing patterns
	{
		files: [
			'**/__tests__/**/*.{ts,tsx}',
			'**/*.test.{ts,tsx}',
			'jest.setup.ts'
		],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'@next/next/no-img-element': 'off'
		}
	},
	{
		rules: {
			'react/display-name': 'off'
		}
	},
	eslintConfigPrettier,
	eslintPluginPrettierRecommended
];

export default eslintConfig;

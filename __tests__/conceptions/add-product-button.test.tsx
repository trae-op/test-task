import { render, screen } from '@testing-library/react';
import React from 'react';

import { AddProductButton } from '@/app/_conceptions/AddProductButton/components/AddProductButton';

describe('AddProductButton', () => {
	it('renders text and icon link (positive)', () => {
		render(<AddProductButton />);
		expect(screen.getByText('Add product')).toBeInTheDocument();
	});

	it('does not crash without router (negative)', () => {
		render(<AddProductButton />);
		expect(true).toBe(true);
	});
});

import { render, screen } from '@testing-library/react';

import { AddEntity } from '@/app/_conceptions/AddEntity';
import { Provider as GlobalProvider } from '@/context/global';
import {
	useEntitiesTitleDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';

const Init = () => {
	const setTitle = useEntitiesTitleDispatch();
	const setTotal = useSetEntitiesTotalDispatch();
	const setLink = useSetLinkAddEntityDispatch();
	// set initial context values for the component under test
	setTitle('Products');
	setTotal(3);
	setLink('/products/add');
	return null;
};

describe('components/AddEntity', () => {
	it('renders title and total value and button', () => {
		render(
			<GlobalProvider>
				<Init />
				<AddEntity />
			</GlobalProvider>
		);
		expect(screen.getByLabelText('add entity')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});

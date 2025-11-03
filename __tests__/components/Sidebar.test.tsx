import { render, screen } from '@testing-library/react';

import { Sidebar } from '@/app/_conceptions/Sidebar/Sidebar';
import { Provider as GlobalProvider } from '@/context/global';
import { useSetAvatarProfileDispatch } from '@/context/global/useContext';

const Init = () => {
	const setAvatar = useSetAvatarProfileDispatch();
	setAvatar('http://localhost/');
	return null;
};

describe('components/Sidebar', () => {
	it('renders nav items', () => {
		render(
			<GlobalProvider>
				<Init />
				<Sidebar
					items={[
						{ href: '/orders', label: 'orders' },
						{ href: '/products', label: 'products' }
					]}
				/>
			</GlobalProvider>
		);
		// useTranslations mock returns key string itself
		expect(screen.getByText('orders')).toBeInTheDocument();
		expect(screen.getByText('products')).toBeInTheDocument();
	});
});

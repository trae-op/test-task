import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import { checkPathnames } from '@/utils/checkPathnames/checkPathnames';
import { fetchOrders } from '@/utils/orders';
import { fetchProducts } from '@/utils/products';

import styles from './AddEntity.module.scss';
import { Title } from './Title';

const BLOCK = 'add-entity';

export const AddEntity = async () => {
	const result = await checkPathnames([
		{
			pathname: 'orders',
			fetch: async () => await fetchOrders()
		},
		{
			pathname: 'products',
			fetch: async () => await fetchProducts()
		}
	]);

	if (!result) {
		return null;
	}

	const { href, displayTotal, displayTitle } = result;

	return (
		<div className={styles[BLOCK]}>
			<NavigationLink
				href={href}
				component={AddEntityButton}
				aria-label='add entity'
			/>

			<Title title={displayTitle} total={displayTotal} />
		</div>
	);
};

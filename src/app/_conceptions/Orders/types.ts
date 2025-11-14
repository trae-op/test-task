import type { TOrder } from '@/types/orders';
import type { TPrice } from '@/types/price';

export type TEntity = TOrder;

export type TOrderProps = TEntity & {
	isDeleteButton?: boolean;
	isUpdateButton?: boolean;
	prices?: TPrice[];
};

export type TOrdersProps = Pick<
	TOrderProps,
	'isDeleteButton' | 'isUpdateButton'
> & {
	items?: TEntity[];
};

export type TDeleteEntityProps = {
	id: string;
};

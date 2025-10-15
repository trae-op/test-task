import type { TEntityId } from './types';

export const getOrderDetailHref = (id: TEntityId): string => `/orders/${id}`;

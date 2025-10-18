import type { TEntityId } from './types';

export const getOrderDetailHref = (id: TEntityId): string => `/orders/${id}`;
export const getProfileHref = (): string => '/profile';
export const getOrdersHref = (): string => '/orders';
export const getSignInHref = (): string => '/sign-in';
export const getSignUpHref = (): string => '/sign-up';

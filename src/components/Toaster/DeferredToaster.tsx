'use client';

import dynamic from 'next/dynamic';

const InitToaster = dynamic(
	() => import('./InitToaster').then(m => m.InitToaster),
	{ ssr: false, loading: () => null }
);

export const DeferredToaster = () => {
	return <InitToaster />;
};

export default DeferredToaster;

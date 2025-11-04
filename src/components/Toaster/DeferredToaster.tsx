'use client';

import dynamic from 'next/dynamic';

// Defer loading react-hot-toast to the client only
const InitToaster = dynamic(
	() => import('./InitToaster').then(m => m.InitToaster),
	{ ssr: false, loading: () => null }
);

export const DeferredToaster = () => {
	return <InitToaster />;
};

export default DeferredToaster;

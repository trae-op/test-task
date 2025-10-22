'use client';

import { AlertError } from '@/components/AlertError';
import type { ErrorPageParams } from '@/components/AlertError/types';

const ErrorPage = ({ error }: ErrorPageParams) => {
	return <AlertError text={error.message} />;
};

export default ErrorPage;

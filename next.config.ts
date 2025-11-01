import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
			{ protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' }
		]
	}
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

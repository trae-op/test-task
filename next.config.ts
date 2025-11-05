import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// enable bundle analyzer when ANALYZE env var is set
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
			{ protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' }
		]
	}
};

const withNextIntl = createNextIntlPlugin();
export default withBundleAnalyzer(withNextIntl(nextConfig));

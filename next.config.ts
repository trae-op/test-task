import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// enable bundle analyzer when ANALYZE env var is set (ESM import)
const withBundleAnalyzer = bundleAnalyzer({
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

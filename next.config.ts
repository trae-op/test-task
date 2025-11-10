import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// enable bundle analyzer when ANALYZE env var is set (ESM import)
const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig: NextConfig = {
	images: {
		...(process.env.NODE_ENV === 'production'
			? {
					loader: 'custom',
					loaderFile: './src/utils/imageLoader.ts'
				}
			: {}),
		remotePatterns: [
			{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
			{ protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' }
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
};

const withNextIntl = createNextIntlPlugin();
export default withBundleAnalyzer(withNextIntl(nextConfig));

import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isAnalyzeEnabled = () => process.env.ANALYZE === 'true';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: isAnalyzeEnabled()
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
	}
};

const withNextIntl = createNextIntlPlugin();
export default withBundleAnalyzer(withNextIntl(nextConfig));

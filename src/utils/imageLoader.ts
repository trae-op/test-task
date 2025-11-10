'use client';

type TLoaderParams = {
	src: string;
	width: number;
	quality?: number;
};

const CDN_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL ?? '';
const normalizeSrc = (src: string): string => {
	if (!src) return '';
	if (/^https?:\/\//.test(src)) return src;
	if (!CDN_BASE) return src;
	const sanitized = src.startsWith('/') ? src.slice(1) : src;
	return `${CDN_BASE.replace(/\/$/, '')}/${sanitized}`;
};

const buildTransform = (
	existing: string[],
	width: number,
	quality?: number
): string => {
	const tokens = [...existing];
	const widthToken = `w-${width}`;
	if (!tokens.includes(widthToken)) tokens.push(widthToken);
	if (quality) {
		const qualityToken = `q-${quality}`;
		if (!tokens.includes(qualityToken)) tokens.push(qualityToken);
	}
	return tokens.join(',');
};

export default function imageLoader({
	src,
	width,
	quality
}: TLoaderParams): string {
	const target = normalizeSrc(src);
	if (!target) return '';
	const url = new URL(target);
	const existingTransforms =
		url.searchParams
			.get('tr')
			?.split(',')
			.map(token => token.trim())
			.filter(Boolean) ?? [];
	const transform = buildTransform(existingTransforms, width, quality);
	url.searchParams.set('tr', transform);
	return url.toString();
}

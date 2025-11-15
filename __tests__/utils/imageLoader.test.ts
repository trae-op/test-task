import imageLoader from '@/utils/imageLoader';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
	process.env = { ...ORIGINAL_ENV };
});

describe('imageLoader', () => {
	test('returns empty string for empty src', () => {
		const url = imageLoader({ src: '', width: 100 });
		expect(url).toBe('');
	});

	test('normalizes relative src with CDN base and adds transforms', () => {
		process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL =
			'https://ik.imagekit.io/dictionaries';
		const url = imageLoader({ src: '/path/img.jpg', width: 200, quality: 80 });
		expect(url).toContain('https://ik.imagekit.io/dictionaries/path/img.jpg');
		expect(url).toContain('tr=');
	});

	test('preserves absolute URLs and appends transforms', () => {
		const url = imageLoader({
			src: 'https://other.example.com/img.jpg',
			width: 300
		});
		expect(url).toContain('https://other.example.com/img.jpg');
		const parsed = new URL(url);
		expect(parsed.searchParams.get('tr')).toContain('w-300');
	});

	test('merges with existing transform parameters', () => {
		const initial = 'https://cdn.example.com/img.jpg?tr=q-50';
		const url = imageLoader({ src: initial, width: 150, quality: 90 });
		const parsed = new URL(url);
		const tr = parsed.searchParams.get('tr');
		expect(tr).toContain('q-50');
		expect(tr).toContain('w-150');
		expect(tr).toContain('q-90');
	});
});

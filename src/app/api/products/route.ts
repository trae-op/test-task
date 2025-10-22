import { NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

export async function GET() {
	try {
		const products = await prisma.product.findMany({
			orderBy: { date: 'desc' },
			include: {
				prices: true,
				orders: { select: { id: true } }
			}
		});

		const data = products.map(p => ({
			id: p.id,
			title: p.title || undefined,
			serialNumber: p.serialNumber || undefined,
			type: p.type || undefined,
			date: p.date || undefined,
			price:
				p.prices?.map(pr => ({
					value: Number(pr.value),
					symbol: pr.symbol,
					isDefault: pr.isDefault ? 1 : 0
				})) || undefined,
			isNew: p.isNew ? 1 : 0,
			photo: p.photo || undefined,
			specification: p.specification || undefined,
			guarantee:
				p.guaranteeStart && p.guaranteeEnd
					? { start: p.guaranteeStart, end: p.guaranteeEnd }
					: undefined
		}));

		return NextResponse.json(data);
	} catch (e) {
		return NextResponse.json(
			{ error: 'Failed to load products' },
			{ status: 500 }
		);
	}
}

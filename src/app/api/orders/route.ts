import { NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

export async function GET() {
	try {
		const orders = await prisma.order.findMany({
			orderBy: { date: 'desc' },
			include: {
				prices: true,
				products: { select: { id: true } }
			}
		});

		const data = orders.map(o => ({
			id: o.id,
			title: o.title || undefined,
			date: o.date || undefined,
			description: o.description || undefined,
			price:
				o.prices?.map(pr => ({
					value: Number(pr.value),
					symbol: pr.symbol,
					isDefault: pr.isDefault ? 1 : 0
				})) || undefined,
			products: o.products?.map(p => p.id) || undefined
		}));

		return NextResponse.json(data);
	} catch (e) {
		return NextResponse.json(
			{ error: 'Failed to load orders' },
			{ status: 500 }
		);
	}
}

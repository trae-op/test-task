type TFoundPrice = {
	id: string;
	symbol: string;
	value: number;
	isDefault: boolean;
};
type TNewPrice = { symbol: string; value: number; isDefault: boolean };

export function findChangedPrices({
	foundPrices,
	newPrices
}: {
	foundPrices: TFoundPrice[];
	newPrices: TNewPrice[];
}): { toDelete: string[]; toCreate: TNewPrice[]; hasChanges: boolean } {
	const currentBySymbol = new Map<string, TFoundPrice>();
	for (const p of foundPrices || []) {
		currentBySymbol.set(String(p.symbol), {
			id: String(p.id),
			symbol: String(p.symbol),
			value: Number(p.value) || 0,
			isDefault: Boolean(p.isDefault)
		});
	}

	const nextBySymbol = new Map<string, TNewPrice>();
	for (const p of newPrices || []) {
		nextBySymbol.set(String(p.symbol), {
			symbol: String(p.symbol),
			value: Number(p.value) || 0,
			isDefault: Boolean(p.isDefault)
		});
	}

	const toDelete: string[] = [];
	const toCreate: TNewPrice[] = [];

	// Delete missing or changed
	for (const [symbol, cur] of currentBySymbol) {
		const next = nextBySymbol.get(symbol);
		if (!next) {
			toDelete.push(cur.id);
			continue;
		}
		if (cur.value !== next.value || cur.isDefault !== next.isDefault) {
			toDelete.push(cur.id);
			toCreate.push({ symbol, value: next.value, isDefault: next.isDefault });
		}
	}

	// Create new ones
	for (const [symbol, next] of nextBySymbol) {
		if (!currentBySymbol.has(symbol)) {
			toCreate.push({ symbol, value: next.value, isDefault: next.isDefault });
		}
	}

	const hasChanges = toDelete.length > 0 || toCreate.length > 0;
	return { toDelete, toCreate, hasChanges };
}

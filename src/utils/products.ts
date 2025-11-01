type TFound = { id: string };

export function findChangedProducts({
	foundProducts,
	newProductIds
}: {
	foundProducts: TFound[];
	newProductIds: string[];
}): { toDisconnect: string[]; toConnect: string[]; hasChanges: boolean } {
	const current = new Set((foundProducts || []).map(p => String(p.id)));
	const next = new Set((newProductIds || []).map(String));

	const toDisconnect: string[] = [];
	const toConnect: string[] = [];

	for (const id of current) {
		if (!next.has(id)) toDisconnect.push(id);
	}
	for (const id of next) {
		if (!current.has(id)) toConnect.push(id);
	}

	const hasChanges = toDisconnect.length > 0 || toConnect.length > 0;
	return { toDisconnect, toConnect, hasChanges };
}

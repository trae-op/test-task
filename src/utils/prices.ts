type TPriceBase = {
	[key: string]: string | number | boolean;
};

export function findChangedPrices<P extends TPriceBase, N extends TPriceBase>({
	foundDefaultPrices,
	transformNewPrices,
	userId,
	productId
}: {
	foundDefaultPrices: P[];
	transformNewPrices: N[];
	userId: string;
	productId: string;
}): N[] {
	if (foundDefaultPrices.length !== transformNewPrices.length) {
		return transformNewPrices;
	}

	const allMatch = transformNewPrices.every(newPrice => {
		const found = foundDefaultPrices.find(
			p =>
				p.symbol === newPrice.symbol &&
				p.userId === userId &&
				p.productId === productId
		);
		return (
			found &&
			found.value === newPrice.value &&
			found.isDefault === newPrice.isDefault
		);
	});

	return allMatch ? [] : transformNewPrices;
}

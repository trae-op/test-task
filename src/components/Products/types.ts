export type TProductDate = {
  day: string;
  month: string;
  year: string;
};

export type TProductStatus = "free" | "repair";

export type TProductCondition = "new" | "used";

export type TProductData = {
  id: string;
  name: string;
  sku: string; // serial number
  image?: string;
  status: TProductStatus;
  availabilityLabel: string; // e.g. "свободен" | "В ремонте"
  period: { from: TProductDate; to: TProductDate };
  condition: TProductCondition; // "new" | "used"
  inStock: number;
  priceUSD?: number;
  priceUAH: number;
  groupName?: string; // may be "—"
  ownerName?: string; // may be empty
  receiptName: string;
  receiptDate: TProductDate;
};

export type TProductProps = {
  data: TProductData;
};

export type TProductsProps = {
  items: TProductData[];
};

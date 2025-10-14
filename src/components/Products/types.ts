export type TPrice = {
  value: number;
  symbol: "USD" | "UAH";
  isDefault: 0 | 1;
};

export type TGuarantee = {
  start: Date;
  end: Date;
};

export type TProductData = {
  id: string;
  title: string;
  serialNumber: string;
  type: string;
  date?: Date;
  price: TPrice[];
  isNew: 0 | 1;
  photo: string;
  specification: string;
  guarantee: TGuarantee;
  order: number;
};

export type TProductProps = TProductData;

export type TProductsProps = {
  items: TProductData[];
};

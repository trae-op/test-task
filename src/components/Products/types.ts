export type TProductData = {
  id: string;
  name: string;
  productCount: number;
  date: {
    day: string;
    month: string;
    year: string;
  };
  priceUSD?: number;
  priceUAH: number;
};

export type TProductProps = {
  data: TProductData;
};

export type TProductsProps = {
  items: TProductData[];
};

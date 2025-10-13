export type TOrderData = {
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

export type TOrderProps = {
  data: TOrderData;
};

export type TOrdersProps = {
  items: TOrderData[];
};

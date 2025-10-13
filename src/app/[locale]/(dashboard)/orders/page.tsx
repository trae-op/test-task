import { OrderTable } from "@/components/Orders";
import type { TOrderData } from "@/components/Orders/types";

const dummyData: TOrderData[] = [
  {
    id: "1",
    name: "Длинное предлинное длиннющее название прихода",
    productCount: 23,
    date: { day: "04", month: "12", year: "2017" },
    priceUSD: 2500,
    priceUAH: 250000.5,
  },
  {
    id: "2",
    name: "Длинное название прихода",
    productCount: 23,
    date: { day: "09", month: "12", year: "2017" },
    priceUAH: 50.0,
  },
  {
    id: "3",
    name: "Длинное предлинное длиннющее название прихода",
    productCount: 23,
    date: { day: "06", month: "12", year: "2017" },
    priceUSD: 2500.85,
    priceUAH: 50.25,
  },
  {
    id: "4",
    name: "Длинное предлинное название прихода",
    productCount: 23,
    date: { day: "02", month: "12", year: "2017" },
    priceUAH: 50.25,
  },
];

export default function OrdersPage() {
  return (
    <>
      <OrderTable items={dummyData} />
    </>
  );
}

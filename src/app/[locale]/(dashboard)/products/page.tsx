import { ProductTable } from "@/components/Products";
import type { TProductData } from "@/components/Products/types";

const dummyProducts: TProductData[] = [
  {
    id: "p1",
    name: "Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3",
    sku: "12.3456789",
    image: "https://placehold.co/96x64.png",
    status: "free",
    availabilityLabel: "свободен",
    period: {
      from: { day: "06", month: "04", year: "2017" },
      to: { day: "06", month: "08", year: "2025" },
    },
    condition: "new",
    inStock: 1,
    priceUSD: 2500,
    priceUAH: 250000.5,
    groupName: "Длинное предлинное  длиннючее название группы",
    ownerName: "—",
    receiptName: "Длинное предлинное  длиннючее название прихода",
    receiptDate: { day: "06", month: "12", year: "2017" },
  },
  {
    id: "p2",
    name: "Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3",
    sku: "12.3456789",
    image: "https://placehold.co/96x64.png",
    status: "repair",
    availabilityLabel: "В ремонте",
    period: {
      from: { day: "06", month: "04", year: "2017" },
      to: { day: "06", month: "08", year: "2025" },
    },
    condition: "used",
    inStock: 1,
    priceUSD: 2500,
    priceUAH: 250000.5,
    groupName: "Длинное предлинное  длиннючее название группы",
    ownerName: "—",
    receiptName: "Длинное предлинное  длиннючее название прихода",
    receiptDate: { day: "06", month: "12", year: "2017" },
  },
  {
    id: "p3",
    name: "Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3",
    sku: "12.3456789",
    image: "https://placehold.co/96x64.png",
    status: "free",
    availabilityLabel: "свободен",
    period: {
      from: { day: "06", month: "04", year: "2017" },
      to: { day: "06", month: "08", year: "2025" },
    },
    condition: "new",
    inStock: 1,
    priceUSD: 2500,
    priceUAH: 250000.5,
    groupName: "—",
    ownerName: "Христорождественский Александр",
    receiptName: "Длинное предлинное  длиннючее название прихода",
    receiptDate: { day: "06", month: "12", year: "2017" },
  },
  {
    id: "p4",
    name: "Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3",
    sku: "12.3456789",
    image: "https://placehold.co/96x64.png",
    status: "repair",
    availabilityLabel: "В ремонте",
    period: {
      from: { day: "06", month: "04", year: "2017" },
      to: { day: "06", month: "08", year: "2025" },
    },
    condition: "used",
    inStock: 1,
    priceUSD: 2500,
    priceUAH: 250000.5,
    groupName: "Длинное предлинное  длиннючее название группы",
    ownerName: "—",
    receiptName: "Длинное предлинное  длиннючее название прихода",
    receiptDate: { day: "06", month: "12", year: "2017" },
  },
];

export default function ProductsPage() {
  return <ProductTable items={dummyProducts} />;
}

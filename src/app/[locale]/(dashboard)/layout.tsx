import { TopHeader } from "@/components/TopHeader.ts";
import styles from "./Layout.module.scss";
import { Sidebar } from "@/components/Sidebar";
import type { TSidebarNavItem } from "@/components/Sidebar/types";
import { AddContent } from "@/components/AddContent";

const navigationItems: TSidebarNavItem[] = [
  { href: "/orders", label: "Receipts" },
  { href: "/products", label: "Products" },
];
// title, currentValue, totalValue
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles["dashboard"]}>
      <TopHeader />
      <div className={styles["dashboard__container"]}>
        <Sidebar items={navigationItems} />
        <div className={styles["dashboard__content"]}>
          <AddContent title="title" totalValue={40} />
          {children}
        </div>
      </div>
    </div>
  );
}

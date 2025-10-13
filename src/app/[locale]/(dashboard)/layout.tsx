import { TopHeader } from "@/components/TopHeader.ts";
import styles from "./Layout.module.scss";
import { Sidebar } from "@/components/Sidebar";
import type { TSidebarNavItem } from "@/components/Sidebar/types";

const navigationItems: TSidebarNavItem[] = [
  { href: "/orders", label: "Receipts" },
  { href: "/products", label: "Products" },
];

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles["dashboard-layout"]}>
      <TopHeader />
      <div>
        <Sidebar items={navigationItems} />
        {children}
      </div>
    </div>
  );
}

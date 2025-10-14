"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { GearFill } from "react-bootstrap-icons";
import { Picture } from "@/components/ui/Picture";
import { NavigationLink } from "@/components/ui/NavigationLink";
import { NavItem } from "./SidebarNavItem";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import styles from "./Sidebar.module.scss";
import type { TSidebarProps } from "./types";

const BLOCK = "sidebar";

export const Sidebar = memo(({ items }: TSidebarProps) => {
  const tReceipts = useTranslations("App.sidebar");

  return (
    <div className={styles[BLOCK]}>
      <div className={styles[`${BLOCK}__profile`]}>
        <Picture
          src="https://placehold.co/600x400/000000/FFFFFF.png"
          alt="Ava"
          size="full"
          loading="lazy"
          className={styles[`${BLOCK}__avatar`]}
        />

        <CircleActionButton
          onClick={() => console.log(1111)}
          Icon={GearFill}
          className={styles[`${BLOCK}__settings-button`]}
          iconClassName={styles[`${BLOCK}__settings-button-icon`]}
          aria-label="settings"
        />
      </div>
      <nav className={styles[`${BLOCK}__nav`]}>
        {items.map(({ href, label }) => (
          <NavigationLink
            key={label}
            href={href}
            text={tReceipts(label)}
            component={NavItem}
          />
        ))}
      </nav>
    </div>
  );
});

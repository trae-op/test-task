import { memo, useMemo } from "react";
import { clsx } from "clsx";
import type { TNavItemProps } from "./types";
import styles from "./SidebarNavItem.module.scss";

export const NavItem = memo((props: TNavItemProps) => {
  const { text, isActive } = props;

  const navItemClass = useMemo(() => {
    return clsx(styles["nav-item"], {
      [styles["nav-item--active"]]: isActive,
    });
  }, [isActive]);

  return <span className={navItemClass}>{text}</span>;
});

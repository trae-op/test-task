import { memo } from "react";
import type { TNavItemProps } from "./types";
import styles from "./SidebarNavItem.module.scss";

export const NavItem = memo(({ text, isActive }: TNavItemProps) => (
  <span
    className={`
          ${styles["nav-item"]}
          ${isActive ? styles["nav-item--active"] : ""}
        `}
  >
    {text}
  </span>
));

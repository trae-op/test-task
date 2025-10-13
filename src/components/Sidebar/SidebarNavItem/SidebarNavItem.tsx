import { memo } from "react";
import { NavigationLink } from "@/components/ui/NavigationLink";
import { NavItem } from "./NavItem";
import type { TSidebarNavItem } from "../types";

export const SidebarNavItem = memo(({ label, href }: TSidebarNavItem) => (
  <NavigationLink href={href} text={label} component={NavItem} />
));

import { ComponentProps, ComponentType } from "react";
import { Link } from "@/i18n/navigation";

export type NavigationItemProps = {
  isActive: boolean;
  text?: string;
};

export type NavigationLinkProps = Omit<
  ComponentProps<typeof Link>,
  "children"
> &
  Pick<NavigationItemProps, "text"> & {
    component: ComponentType<NavigationItemProps>;
  };

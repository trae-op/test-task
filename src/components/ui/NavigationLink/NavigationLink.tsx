"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { NavigationLinkProps } from "./types";

export const NavigationLink = ({
  href,
  component: Component,
  text,
  ...rest
}: NavigationLinkProps) => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const isActive = pathname === href;

  return (
    <Link href={href} {...rest}>
      <Component isActive={isActive} text={text} />
    </Link>
  );
};

"use client";

import { memo, useMemo } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { NavigationLinkProps } from "./types";

export const NavigationLink = memo(
  ({ href, component: Component, text, ...rest }: NavigationLinkProps) => {
    const selectedLayoutSegment = useSelectedLayoutSegment();

    const pathname = useMemo(
      () => (selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/"),
      [selectedLayoutSegment]
    );

    const isActive = useMemo(() => pathname === href, [pathname, href]);

    return (
      <Link href={href} {...rest}>
        <Component isActive={isActive} text={text} />
      </Link>
    );
  }
);

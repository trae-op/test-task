"use client";

import { Gear } from "react-bootstrap-icons";
import { CircleActionButton } from "@/components/ui/CircleActionButton/CircleActionButton";

export default function Button() {
  return (
    <CircleActionButton
      Icon={Gear}
      aria-label="settings"
      iconClassName="custom-icon"
    />
  );
}

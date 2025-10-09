"use client";

import { Gear } from "react-bootstrap-icons";
import { CircleActionButton } from "@/components/ui/CircleActionButton";

export default function IndependentComponents() {
  return (
    <>
      <CircleActionButton Icon={Gear} aria-label="settings" />
    </>
  );
}

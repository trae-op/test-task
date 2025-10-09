"use client";

import { Gear } from "react-bootstrap-icons";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";

export default function IndependentComponents() {
  return (
    <>
      <CircleActionButton Icon={Gear} aria-label="settings" />
      <TextField type="search" placeholder="enter" />
    </>
  );
}

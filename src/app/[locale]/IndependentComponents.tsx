"use client";

import { Gear } from "react-bootstrap-icons";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";

export default function IndependentComponents() {
  return (
    <>
      <CircleActionButton
        onClick={() => console.log(1111)}
        Icon={Gear}
        aria-label="settings"
      />
      <TextField type="search" placeholder="enter" />
    </>
  );
}

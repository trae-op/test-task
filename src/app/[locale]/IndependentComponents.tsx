"use client";

import { Gear, CaretDownFill } from "react-bootstrap-icons";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";

// Caret down fill

export default function IndependentComponents() {
  return (
    <>
      <CircleActionButton
        onClick={() => console.log(1111)}
        Icon={Gear}
        aria-label="settings"
      />
      <TextField type="search" placeholder="enter" />
      <SelectField />
    </>
  );
}

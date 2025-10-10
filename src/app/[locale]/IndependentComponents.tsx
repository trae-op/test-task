"use client";

import { useState } from "react";
import { Gear } from "react-bootstrap-icons";
import { MultiValue } from "react-select";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";
import type { OptionType } from "@/components/ui/MultiSelectField/types";
import { MultiSelectField } from "@/components/ui/MultiSelectField";

const colourOptions: OptionType[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

export default function IndependentComponents() {
  const [selectedColor, setSelectedColor] = useState<MultiValue<OptionType>>(
    []
  );

  return (
    <>
      <CircleActionButton
        onClick={() => console.log(1111)}
        Icon={Gear}
        aria-label="settings"
      />
      <TextField type="search" placeholder="enter" />
      <MultiSelectField
        instanceId="color-selector"
        options={colourOptions}
        value={selectedColor}
        onChange={(newValue: MultiValue<OptionType>) =>
          setSelectedColor(newValue)
        }
        placeholder="Choose a color..."
      />
    </>
  );
}

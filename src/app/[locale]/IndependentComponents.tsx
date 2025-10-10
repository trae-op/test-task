"use client";

import { useState } from "react";
import { Gear } from "react-bootstrap-icons";
import { SingleValue, StylesConfig } from "react-select";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";
import { OptionType, SelectField } from "@/components/ui/SelectField";

const colourOptions: OptionType[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

export default function IndependentComponents() {
  const [selectedColor, setSelectedColor] =
    useState<SingleValue<OptionType>>(null);

  return (
    <>
      <CircleActionButton
        onClick={() => console.log(1111)}
        Icon={Gear}
        aria-label="settings"
      />
      <TextField type="search" placeholder="enter" />
      <SelectField
        instanceId="color-selector"
        options={colourOptions}
        value={selectedColor}
        onChange={(newValue) => setSelectedColor(newValue)}
        placeholder="Choose a color..."
      />
    </>
  );
}

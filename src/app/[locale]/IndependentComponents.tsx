"use client";

import { useState } from "react";
import { Gear } from "react-bootstrap-icons";
import { MultiValue } from "react-select";
import { CircleActionButton } from "@/components/ui/CircleActionButton";
import { TextField } from "@/components/ui/TextField";
import type { OptionType } from "@/components/ui/MultiSelectField/types";
import { MultiSelectField } from "@/components/ui/MultiSelectField";
import { SelectField } from "@/components/ui/SelectField";
import { SelectOption } from "@/components/ui/SelectField/types";

const colourOptions: OptionType[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

const options: SelectOption[] = [
  { value: "moni", label: "Moni" },
  { value: "usd", label: "US Dollar" },
  { value: "eur", label: "Euro" },
  { value: "gbp", label: "British Pound" },
];

export default function IndependentComponents() {
  const [selectedColor, setSelectedColor] = useState<MultiValue<OptionType>>(
    []
  );
  const [currency, setCurrency] = useState<string | number>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

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
      <SelectField
        options={options}
        value={currency}
        onChange={handleSelectChange}
      />
    </>
  );
}

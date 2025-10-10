"use client";

import React, { useState } from "react";
import Select, { SingleValue, ActionMeta, StylesConfig } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

type SelectedOption = SingleValue<OptionType>;

const colourOptions: OptionType[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
];

const customStyles: StylesConfig<OptionType, false> = {
  // ... (Ваші стилі залишилися незмінними)
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    minHeight: "38px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#ced4da",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: "2px 8px",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#6c757d",
  }),
};

export const SelectField: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SelectedOption>(null);

  const handleSelectChange = (
    newValue: SelectedOption,
    actionMeta: ActionMeta<OptionType>
  ) => {
    setSelectedItem(newValue);
    console.log(`Action: ${actionMeta.action}`, newValue);
  };

  return (
    <div>
      <h3>Select Component</h3>
      <Select<OptionType, false>
        // 🚀 Ключове виправлення: Додавання instanceId
        // Це гарантує, що ID, згенеровані react-select, будуть однаковими на сервері та клієнті.
        // Це має бути унікальний рядок для цього конкретного селектора.
        instanceId="colour-select-id"
        options={colourOptions}
        value={selectedItem}
        onChange={handleSelectChange}
        placeholder="Select a color..."
        styles={customStyles}
      />
      <p style={{ marginTop: "10px" }}>
        Обрано:
        <strong>{selectedItem ? selectedItem.label : "Нічого"}</strong>
      </p>
    </div>
  );
};

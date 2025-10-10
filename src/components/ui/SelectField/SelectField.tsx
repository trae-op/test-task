"use client";

import React, { useState } from "react";
import Select, {
  SingleValue,
  ActionMeta,
  StylesConfig,
  components,
  DropdownIndicatorProps, // Додаємо тип для пропсів DropdownIndicator
} from "react-select";
import { CaretDownFill } from "react-bootstrap-icons";

interface OptionType {
  value: string;
  label: string;
}

type SelectedOption = SingleValue<OptionType>;

const colourOptions: OptionType[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
];

const CustomDropdownIndicator = (
  props: DropdownIndicatorProps<OptionType, false>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownFill size={12} color="#6c757d" style={{ marginRight: "8px" }} />{" "}
      {/* Розмір та колір як на скріншоті */}
    </components.DropdownIndicator>
  );
};

const customStyles: StylesConfig<OptionType, false> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid #ced4da", // Світло-сіра рамка
    borderRadius: "0.25rem", // Закруглення кутів
    minHeight: "38px", // Стандартна висота
    boxShadow: "none", // Прибираємо тінь при фокусі
    "&:hover": {
      borderColor: "#ced4da", // Залишаємо рамку світло-сірою при наведенні
    },
    // Додаємо відступ праворуч, щоб іконка не прилипала до краю
    // Якщо іконка має свій marginRight, це може бути і не потрібно,
    // але для контролю краще додати тут або в стилях самої іконки.
    paddingRight: "4px",
  }),

  indicatorSeparator: () => ({
    display: "none", // Приховуємо роздільник
  }),

  valueContainer: (styles) => ({
    ...styles,
    padding: "2px 8px", // Відступи для тексту
  }),

  placeholder: (styles) => ({
    ...styles,
    color: "#6c757d", // Колір тексту плейсхолдера
  }),

  // Стилі для опцій у випадаючому списку
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#0d6efd" // Bootstrap primary blue for selected
      : isFocused
      ? "#e9ecef" // Bootstrap light gray for focused
      : undefined, // 💡 ВИПРАВЛЕНО: Використовуємо undefined замість null
    color: isSelected ? "white" : "#212529", // Text color
    "&:active": {
      backgroundColor: "#0a58ca", // Darker blue on active click
    },
  }),
  singleValue: (styles) => ({ ...styles, color: "#212529" }), // Колір обраного значення
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
        components={{ DropdownIndicator: CustomDropdownIndicator }}
      />
      <p style={{ marginTop: "10px" }}>
        Обрано:
        <strong>{selectedItem ? selectedItem.label : "Нічого"}</strong>
      </p>
    </div>
  );
};

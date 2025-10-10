"use client";

import React, { useMemo } from "react";
import Select, {
  SingleValue,
  ActionMeta,
  StylesConfig,
  components,
  DropdownIndicatorProps,
  Props as SelectProps,
} from "react-select";
import { CaretDownFill } from "react-bootstrap-icons";

export interface OptionType {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectProps<OptionType, false> {
  options: OptionType[];
  value: SingleValue<OptionType>;
  onChange: (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  styles?: StylesConfig<OptionType, false>;
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<OptionType, false>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownFill size={12} color="#6c757d" style={{ marginRight: "8px" }} />{" "}
    </components.DropdownIndicator>
  );
};

const defaultStyles: StylesConfig<OptionType, false> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "white",
    "&:hover": {
      borderColor: "#ced4da", // Залишаємо рамку світло-сірою при наведенні
    },
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

export const SelectField: React.FC<SelectFieldProps> = ({
  options,
  value,
  onChange,
  styles,
  ...rest
}) => {
  const mergeStyles = useMemo(() => {
    if (!styles) {
      return defaultStyles;
    }

    return {
      ...defaultStyles,
      ...styles,
    };
  }, [styles]);

  return (
    <Select<OptionType, false>
      options={options}
      value={value}
      onChange={onChange}
      styles={mergeStyles}
      components={{ DropdownIndicator }}
      {...rest}
    />
  );
};

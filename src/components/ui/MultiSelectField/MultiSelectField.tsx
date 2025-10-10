"use client";

import React, { useMemo } from "react";
import Select from "react-select";
import type { OptionType, SelectFieldProps } from "./types";
import { DropdownIndicator } from "./DropdownIndicator";
import { defaultStyles } from "./defaultStyles";

export const MultiSelectField: React.FC<SelectFieldProps> = ({
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
    <Select<OptionType, true>
      isMulti={true}
      options={options}
      value={value}
      onChange={onChange}
      styles={mergeStyles}
      components={{ DropdownIndicator }}
      {...rest}
    />
  );
};

import { CaretDownFill } from "react-bootstrap-icons";
import { components, DropdownIndicatorProps } from "react-select";
import type { OptionType } from "./types";

export const DropdownIndicator = (
  props: DropdownIndicatorProps<OptionType, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownFill size={12} color="#6c757d" style={{ marginRight: 5 }} />
    </components.DropdownIndicator>
  );
};

import { StylesConfig } from "react-select";
import type { OptionType } from "./types";

export const defaultStyles: StylesConfig<OptionType, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    paddingRight: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "gray" : isFocused ? "#ccc" : undefined,
    color: isSelected ? "white" : "#212529",
    "&:active": {
      backgroundColor: "#ccc",
    },
  }),
  singleValue: (styles) => ({ ...styles, color: "#212529" }),
};

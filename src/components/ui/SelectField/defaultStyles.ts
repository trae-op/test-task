import { StylesConfig } from "react-select";
import type { OptionType } from "./types";

const dimgray = "dimgray";
const white = "white";
const lightGray = "#ccc";

export const defaultStyles: StylesConfig<OptionType, false> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: white,
    paddingRight: 0,
    boxShadow: "none",
    borderColor: isFocused ? dimgray : styles.borderColor,
    "&:active, &:hover": {
      borderColor: dimgray,
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? dimgray : isFocused ? lightGray : undefined,
    color: isSelected ? white : dimgray,
    "&:active": {
      backgroundColor: lightGray,
    },
  }),
  singleValue: (styles) => ({ ...styles, color: dimgray }),
};

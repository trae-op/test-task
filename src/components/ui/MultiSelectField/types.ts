import {
  ActionMeta,
  StylesConfig,
  MultiValue,
  Props as SelectProps,
} from "react-select";

export interface OptionType {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectProps<OptionType, true> {
  options: OptionType[];
  value: MultiValue<OptionType>;
  onChange: (
    newValue: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  styles?: StylesConfig<OptionType, true>;
}

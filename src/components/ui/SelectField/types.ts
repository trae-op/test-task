import {
  SingleValue,
  ActionMeta,
  StylesConfig,
  Props as SelectProps,
} from "react-select";

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

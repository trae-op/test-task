import {
	ActionMeta,
	MultiValue,
	Props as SelectProps,
	StylesConfig
} from 'react-select';

export interface OptionType {
	value: string;
	label: string;
	valueAmount?: number;
	isDefault?: boolean;
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

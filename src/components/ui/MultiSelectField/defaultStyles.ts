import { StylesConfig } from 'react-select';

import type { OptionType } from './types';

const dimgray = 'dimgray';
const white = 'white';
const lightGray = '#ccc';

export const defaultStyles: StylesConfig<OptionType, true> = {
	control: (styles, { isFocused }) => ({
		...styles,
		backgroundColor: white,
		paddingRight: 0,
		boxShadow: 'none',
		borderColor: isFocused ? dimgray : styles.borderColor,
		'&:active, &:hover': {
			borderColor: dimgray
		}
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isSelected ? dimgray : isFocused ? lightGray : undefined,
		color: isSelected ? white : dimgray,
		'&:active': {
			backgroundColor: lightGray
		},
		'&:hover': {
			backgroundColor: '#f0f0f0'
		}
	}),
	singleValue: styles => ({ ...styles, color: dimgray }),
	multiValueRemove: styles => ({
		...styles,
		':hover': {
			backgroundColor: dimgray,
			color: white,
			cursor: 'pointer'
		}
	}),
	placeholder: styles => ({
		...styles,
		color: 'black'
	})
};

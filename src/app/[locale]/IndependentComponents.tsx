'use client';

import { useState } from 'react';
import { Gear, TrashFill } from 'react-bootstrap-icons';
import { MultiValue } from 'react-select';

import { Button } from '@/components/ui/Button';
import { CircleActionButton } from '@/components/ui/CircleActionButton';
import { MultiSelectField } from '@/components/ui/MultiSelectField';
import type { OptionType } from '@/components/ui/MultiSelectField/types';
import { SelectField } from '@/components/ui/SelectField';
import { SelectOption } from '@/components/ui/SelectField/types';
import { TextField } from '@/components/ui/TextField';

const colourOptions: OptionType[] = [
	{ value: 'red', label: 'Red' },
	{ value: 'blue', label: 'Blue' },
	{ value: 'green', label: 'Green' }
];

const options: SelectOption[] = [
	{ value: 'moni', label: 'Moni' },
	{ value: 'usd', label: 'US Dollar' },
	{ value: 'eur', label: 'Euro' },
	{ value: 'gbp', label: 'British Pound' }
];

export default function IndependentComponents() {
	const [selectedColor, setSelectedColor] = useState<MultiValue<OptionType>>(
		[]
	);
	const [currency, setCurrency] = useState<string | number>('');

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrency(event.target.value);
	};

	return (
		<>
			<CircleActionButton
				onClick={() => console.log(1111)}
				Icon={Gear}
				aria-label='settings'
			/>
			<Button
				IconComponent={TrashFill}
				text='button'
				variant='dark'
				onClick={() => console.log('button')}
			/>
			<TextField type='search' placeholder='enter' />
			<MultiSelectField
				instanceId='color-selector'
				options={colourOptions}
				value={selectedColor}
				onChange={(newValue: MultiValue<OptionType>) =>
					setSelectedColor(newValue)
				}
				placeholder='Choose a color...'
			/>
			<SelectField
				options={options}
				value={currency}
				onChange={handleSelectChange}
			/>
		</>
	);
}

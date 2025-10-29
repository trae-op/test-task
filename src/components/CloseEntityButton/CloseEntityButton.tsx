'use client';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

import { NavigationLink } from '../NavigationLink';

import styles from './CloseEntityButton.module.scss';
import { ActionButtonProps } from './types';

const BLOCK = 'action-btn';

const CloseIcon = () => <X size={20} />;

export const CloseEntityButton = ({
	className = '',
	ariaLabelText,
	href = '/',
	...restProps
}: ActionButtonProps) => (
	<Button
		className={clsx(styles[BLOCK], className)}
		variant='light'
		aria-label={ariaLabelText}
		{...restProps}
	>
		<NavigationLink href={href} component={CloseIcon} className='d-flex' />
	</Button>
);

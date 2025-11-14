import type { ElementType, ReactNode } from 'react';
import type { ModalProps } from 'react-bootstrap';

export type TPopupProps = Omit<ModalProps, 'children'> & {
	title: string;
	applyText?: string;
	cancelText?: string;
	applyDisabled?: boolean;
	onApply?: (handleClose: () => void) => void;
	onCancel?: () => void;
	onOpen?: () => void;
	componentButton: ElementType;
	componentApplyButton?: ElementType;
	iconButton?: ElementType;
	iconApplyButton?: ElementType;
	openButtonClassName?: string;
	applyButtonClassName?: string;
	openButtonAriaLabel?: string;
	isLoading?: boolean;
	children?: ReactNode;
	showApplyButton?: boolean;
};

export type TPopupState = {
	isOpen: boolean;
	entityId?: string;
};

export type TPopupActions = {
	handleOpen: (entityId?: string) => void;
	handleClose: () => void;
};

export type TUsePopup = TPopupState & TPopupActions;

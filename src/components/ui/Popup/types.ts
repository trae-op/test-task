import type { ElementType, ReactNode } from 'react';
import type { ModalProps } from 'react-bootstrap';

export type TConfirmPopupProps = Omit<ModalProps, 'children'> & {
	title: string;
	confirmText?: string;
	cancelText?: string;
	onApply?: (handleClose: () => void) => void;
	onCancel?: () => void;
	componentButton: ElementType;
	componentApplyButton?: ElementType;
	iconButton?: ElementType;
	iconApplyButton?: ElementType;
	openButtonClassName?: string;
	applyButtonClassName?: string;
	children?: ReactNode;
};

export type TConfirmPopupState = {
	isOpen: boolean;
	entityId?: string;
};

export type TConfirmPopupActions = {
	handleOpen: (entityId?: string) => void;
	handleClose: () => void;
};

export type TUseConfirmPopup = TConfirmPopupState & TConfirmPopupActions;

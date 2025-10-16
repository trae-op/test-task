export type TConfirmPopupState = {
	isOpen: boolean;
	entityId?: string;
};

export type TConfirmPopupActions = {
	handleOpen: (entityId?: string) => void;
	handleClose: () => void;
};

export type TUseConfirmPopup = TConfirmPopupState & TConfirmPopupActions;

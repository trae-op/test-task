export type TPopupState = {
	isOpen: boolean;
	entityId?: string;
};

export type TPopupActions = {
	handleOpen: (entityId?: string) => void;
	handleClose: () => void;
};

export type TUsePopup = TPopupState & TPopupActions;

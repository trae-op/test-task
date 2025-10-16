import clsx from 'clsx';
import { type MouseEvent, memo, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { CloseEntityButton } from '@/components/ui/CloseEntityButton';

import { useConfirmPopup } from '@/hooks/confirmPopup';

import styles from './ConfirmPopup.module.scss';
import type { TConfirmPopupProps } from './types';

const BLOCK = 'confirm-popup';

export const ConfirmPopup = memo(
	({
		title,
		confirmText = 'Delete',
		cancelText = 'Cancel',
		onConfirm,
		onCancel,
		onHide,
		show,
		children,
		className,
		componentButton: ComponentButton,
		iconButton: Icon,
		openButtonClassName,
		...rest
	}: TConfirmPopupProps) => {
		const { isOpen, handleOpen, handleClose } = useConfirmPopup();

		const isControlled = show !== undefined;
		const isModalOpen = isControlled ? show : isOpen;

		const handleConfirm = () => {
			onConfirm?.();
			onHide?.();
		};

		const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
			e?.preventDefault();
			if (!isControlled) handleClose();
			onCancel?.();
			onHide?.();
		};

		const handlePopupOpen = useCallback(() => {
			if (!isControlled) handleOpen();
		}, [isControlled, handleOpen]);

		const handleModalHide = useCallback(() => {
			if (!isControlled) handleClose();
			onHide?.();
		}, [isControlled, handleClose, onHide]);

		return (
			<>
				<ComponentButton
					className={openButtonClassName}
					onClick={handlePopupOpen}
				>
					{Icon ? <Icon /> : null}
				</ComponentButton>
				<Modal
					show={isModalOpen}
					onHide={handleModalHide}
					className={clsx(styles[BLOCK], className)}
					dialogClassName={styles[`${BLOCK}__dialog`]}
					contentClassName={styles[`${BLOCK}__content`]}
					centered
					{...rest}
				>
					<div className={clsx('position-relative')}>
						<div className={styles[`${BLOCK}__header`]}>
							<h5 className={styles[`${BLOCK}__title`]}>{title}</h5>
						</div>

						<div className={styles[`${BLOCK}__body`]}>{children}</div>

						<div className={styles[`${BLOCK}__footer`]}>
							<button
								type='button'
								className='btn btn-outline-light'
								onClick={handleCancel}
							>
								{cancelText}
							</button>
							<button
								type='button'
								className='btn btn-light text-danger d-flex align-items-center gap-2'
								onClick={handleConfirm}
							>
								<Trash size={16} />
								{confirmText}
							</button>
						</div>

						<div className={styles[`${BLOCK}__close`]}>
							<CloseEntityButton
								style={{ width: '2rem', height: '2rem' }}
								aria-label='close'
								href='#'
								onClick={handleCancel}
							/>
						</div>
					</div>
				</Modal>
			</>
		);
	}
);

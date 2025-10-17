import clsx from 'clsx';
import { type MouseEvent, memo, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { CloseEntityButton } from '@/components/ui/CloseEntityButton';

import { useConfirmPopup } from '@/hooks/confirmPopup';

import styles from './Popup.module.scss';
import type { TConfirmPopupProps } from './types';

const BLOCK = 'popup';

export const Popup = memo(
	({
		title,
		confirmText = 'Delete',
		cancelText = 'Cancel',
		onApply,
		onCancel,
		onHide,
		show,
		children,
		className,
		componentButton: ComponentButton,
		componentApplyButton: ComponentApplyButton,
		iconButton: Icon,
		applyIconButton: ApplyIcon,
		openButtonClassName,
		applyButtonClassName,
		...rest
	}: TConfirmPopupProps) => {
		const { isOpen, handleOpen, handleClose } = useConfirmPopup();

		const isControlled = show !== undefined;
		const isModalOpen = isControlled ? show : isOpen;

		const handlePopupOpen = () => {
			handleOpen?.();
			onHide?.();
		};

		const popupClose = () => {
			handleClose();
			onCancel?.();
			onHide?.();
		};

		const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
			e?.preventDefault();
			if (!isControlled) handleClose();
			onCancel?.();
			onHide?.();
		};

		const handlePopupApply = useCallback(() => {
			if (!isControlled) {
				onApply?.(popupClose);
			}
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

							{ComponentApplyButton !== undefined ? (
								<ComponentApplyButton
									className={applyButtonClassName}
									onClick={handlePopupApply}
								>
									{ApplyIcon ? <ApplyIcon /> : null}
								</ComponentApplyButton>
							) : (
								<button
									type='button'
									className='btn btn-light text-danger d-flex align-items-center gap-2'
									onClick={handlePopupApply}
								>
									{ApplyIcon ? <ApplyIcon size={16} /> : null}
									{confirmText}
								</button>
							)}
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

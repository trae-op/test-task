import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { type MouseEvent, memo, useCallback, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import { CloseEntityButton } from '@/components/CloseEntityButton';

import styles from './Popup.module.scss';
import type { TPopupProps } from './types';

const BLOCK = 'popup';

const Dialog = dynamic(() => import('react-bootstrap/Modal'), {
	ssr: false,
	loading: () => null
});

export const Popup = memo(
	({
		title,
		applyText,
		cancelText = 'Cancel',
		onApply,
		onCancel,
		onOpen,
		onHide,
		show,
		children,
		className,
		applyDisabled = false,
		componentButton: ComponentButton,
		componentApplyButton: ComponentApplyButton,
		iconButton: Icon,
		applyIconButton: ApplyIcon,
		openButtonClassName,
		openButtonAriaLabel,
		applyButtonClassName,
		isLoading,
		showApplyButton = true,
		...rest
	}: TPopupProps) => {
		const t = useTranslations('App');
		const [isOpen, setIsOpen] = useState(false);

		const isControlled = show !== undefined;
		const isModalOpen = isControlled ? show : isOpen;

		const handleOpen = () => {
			setIsOpen(true);
		};

		const handleClose = () => {
			setIsOpen(false);
		};

		const handlePopupOpen = () => {
			onOpen?.();
			handleOpen?.();
			onHide?.();
		};

		const popupClose = useCallback(() => {
			handleClose();
			onCancel?.();
			onHide?.();
		}, [handleClose, onCancel, onHide]);

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
		}, [isControlled, onApply, popupClose]);

		const handleModalHide = useCallback(() => {
			if (!isControlled) handleClose();
			onHide?.();
		}, [isControlled, handleClose, onHide]);

		return (
			<>
				<ComponentButton
					className={openButtonClassName}
					aria-label={openButtonAriaLabel}
					onClick={handlePopupOpen}
				>
					{Icon ? <Icon /> : null}
				</ComponentButton>
				{isModalOpen ? (
					<Dialog
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
								<h5 className={styles[`${BLOCK}__title`]}>{t(title)}</h5>
							</div>

							<div className={styles[`${BLOCK}__body`]}>{children}</div>

							<div className={styles[`${BLOCK}__footer`]}>
								<button
									type='button'
									className='btn-outline-light btn'
									onClick={handleCancel}
								>
									{t(cancelText, { default: cancelText })}
								</button>

								{showApplyButton ? (
									ComponentApplyButton !== undefined ? (
										<ComponentApplyButton
											className={applyButtonClassName}
											onClick={handlePopupApply}
										>
											{ApplyIcon ? <ApplyIcon /> : null}
										</ComponentApplyButton>
									) : (
										<button
											type='button'
											disabled={isLoading || applyDisabled}
											className={clsx(
												'd-flex align-items-center justify-content-center gap-2 text-danger btn btn-light',
												styles[`${BLOCK}__button-apply`],
												applyButtonClassName
											)}
											onClick={handlePopupApply}
										>
											{isLoading ? (
												<Spinner animation='border' size='sm' />
											) : (
												<>
													{ApplyIcon ? <ApplyIcon size={16} /> : null}
													<span>
														{t(applyText ?? 'Apply', {
															default: applyText ?? 'Apply'
														})}
													</span>
												</>
											)}
										</button>
									)
								) : null}
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
					</Dialog>
				) : null}
			</>
		);
	}
);

export { Popup as ConfirmPopup };

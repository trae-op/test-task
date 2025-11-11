'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { memo, useActionState, useEffect } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useFormStatus } from 'react-dom';

import type { TPickupLocationItem, TPickupLocationListProps } from './types';
import { deletePickupLocationById } from '@/actions/pickupLocation';
import { useEntityContext } from '@/context/pickupLocation/useContext';

type TDeleteButtonProps = {
	ariaLabel: string;
};

const DeleteButton = ({ ariaLabel }: TDeleteButtonProps) => {
	const { pending } = useFormStatus();
	return (
		<button
			aria-label={ariaLabel}
			title={ariaLabel}
			type='submit'
			disabled={pending}
			className={clsx(
				{
					['opacity-50']: pending
				},
				'd-flex align-items-center justify-content-center bg-danger p-3 border-0 rounded text-white'
			)}
		>
			{pending ? <Spinner animation='border' size='sm' /> : <Trash size={16} />}
		</button>
	);
};

type TPickupLocationListItemProps = {
	item: TPickupLocationItem;
	deleteLabel: string;
};

const PickupLocationListItem = memo(
	({ item, deleteLabel }: TPickupLocationListItemProps) => {
		const { get, setAll } = useEntityContext();
		const [state, formAction] = useActionState(deletePickupLocationById, {
			ok: false
		});

		useEffect(() => {
			if (!state.ok) {
				return;
			}

			const current = get();
			const next = current.filter(entity => entity.id !== item.id);
			if (next.length === current.length) {
				return;
			}

			setAll(next);
		}, [state.ok, get, setAll, item.id]);

		return (
			<ListGroup.Item className='d-flex align-items-center justify-content-between gap-1'>
				<span>{item.label}</span>
				<form action={formAction} className='d-inline-flex'>
					<input type='hidden' name='id' value={item.id} />
					<DeleteButton ariaLabel={deleteLabel} />
				</form>
			</ListGroup.Item>
		);
	}
);

export const PickupLocationList = memo(
	({ items }: TPickupLocationListProps) => {
		const t = useTranslations('App');
		const deleteLabel = t('Delete');

		if (!items.length) {
			return (
				<p className='mb-3 text-muted'>
					{t('No pickup locations yet', {
						default: 'No pickup locations yet'
					})}
				</p>
			);
		}

		return (
			<ListGroup className='mb-3 w-100'>
				{items.map(item => (
					<PickupLocationListItem
						key={item.id}
						item={item}
						deleteLabel={deleteLabel}
					/>
				))}
			</ListGroup>
		);
	}
);

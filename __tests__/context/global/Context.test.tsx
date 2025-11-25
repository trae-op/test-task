import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';

import type { TProductType } from '@/types/productType';

import { Provider } from '@/context/global/Context';
import {
	useAvatarProfileSelector,
	useEntitiesTitleDispatch,
	useEntitiesTitleSelector,
	useEntitiesTotalSelector,
	useLinkAddEntitySelector,
	useProductTypesSelector,
	useSetAvatarProfileDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useSelectors';

type TestConsumerProps = {
	children?: ReactNode;
};

function TestConsumer({ children }: TestConsumerProps) {
	const productTypes = useProductTypesSelector();
	const entitiesTotal = useEntitiesTotalSelector();
	const avatarProfile = useAvatarProfileSelector();
	const entitiesTitle = useEntitiesTitleSelector();
	const linkAddEntity = useLinkAddEntitySelector();

	const setAvatarProfile = useSetAvatarProfileDispatch();
	const setEntitiesTitle = useEntitiesTitleDispatch();
	const setEntitiesTotal = useSetEntitiesTotalDispatch();
	const setLinkAddEntity = useSetLinkAddEntityDispatch();

	return (
		<div>
			<div data-testid='product-types-count'>
				{productTypes ? productTypes.length : 0}
			</div>
			<div data-testid='entities-total'>{entitiesTotal ?? 0}</div>
			<div data-testid='avatar-profile'>{avatarProfile ?? ''}</div>
			<div data-testid='entities-title'>{entitiesTitle ?? ''}</div>
			<div data-testid='link-add-entity'>{linkAddEntity ?? ''}</div>
			<button
				data-testid='update-avatar-profile'
				onClick={() => setAvatarProfile('updated-avatar')}
			>
				Update avatar
			</button>
			<button
				data-testid='update-entities-title'
				onClick={() => setEntitiesTitle('Updated title')}
			>
				Update title
			</button>
			<button
				data-testid='update-entities-total'
				onClick={() => setEntitiesTotal(10)}
			>
				Update total
			</button>
			<button
				data-testid='update-link-add-entity'
				onClick={() => setLinkAddEntity('/add-entity')}
			>
				Update link
			</button>
			{children}
		</div>
	);
}

describe('Global Context Provider and hooks', () => {
	const initialAvatar = 'initial-avatar';
	const initialProductTypes: TProductType[] = [
		{ id: '1', userId: '1', value: 'value', title: 'title' }
	];

	function renderWithProvider(ui: ReactNode) {
		return render(
			<Provider
				avatarProfile={initialAvatar}
				productTypes={initialProductTypes}
			>
				{ui}
			</Provider>
		);
	}

	test('provides initial context values to selectors', () => {
		renderWithProvider(<TestConsumer />);

		expect(screen.getByTestId('product-types-count')).toHaveTextContent('1');
		expect(screen.getByTestId('entities-total')).toHaveTextContent('0');
		expect(screen.getByTestId('avatar-profile')).toHaveTextContent(
			'initial-avatar'
		);
		expect(screen.getByTestId('entities-title')).toHaveTextContent('');
		expect(screen.getByTestId('link-add-entity')).toHaveTextContent('');
	});

	test('updates context values through dispatch hooks and notifies selectors', () => {
		renderWithProvider(<TestConsumer />);

		act(() => {
			screen.getByTestId('update-avatar-profile').click();
			screen.getByTestId('update-entities-title').click();
			screen.getByTestId('update-entities-total').click();
			screen.getByTestId('update-link-add-entity').click();
		});

		expect(screen.getByTestId('avatar-profile')).toHaveTextContent(
			'updated-avatar'
		);
		expect(screen.getByTestId('entities-title')).toHaveTextContent(
			'Updated title'
		);
		expect(screen.getByTestId('entities-total')).toHaveTextContent('10');
		expect(screen.getByTestId('link-add-entity')).toHaveTextContent(
			'/add-entity'
		);
	});
});

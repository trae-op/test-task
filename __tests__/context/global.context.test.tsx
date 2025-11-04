import { act, renderHook } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { Provider as GlobalProvider } from '@/context/global';
import {
	useAvatarProfileSelector,
	useEntitiesTitleDispatch,
	useEntitiesTitleSelector,
	useEntitiesTotalSelector,
	useEntityContext,
	useLinkAddEntitySelector,
	useSetAvatarProfileDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';

function createWrapper(props?: { avatarProfile?: string }) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<GlobalProvider avatarProfile={props?.avatarProfile}>
				{children}
			</GlobalProvider>
		);
	};
}

function useGlobalUnderTest() {
	const title = useEntitiesTitleSelector();
	const total = useEntitiesTotalSelector();
	const avatar = useAvatarProfileSelector();
	const link = useLinkAddEntitySelector();

	const setTitle = useEntitiesTitleDispatch();
	const setTotal = useSetEntitiesTotalDispatch();
	const setAvatar = useSetAvatarProfileDispatch();
	const setLink = useSetLinkAddEntityDispatch();

	return { title, total, avatar, link, setTitle, setTotal, setAvatar, setLink };
}

describe('global context', () => {
	it('throws when used outside of Provider', () => {
		// use any hook that reads the context
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'Global useEntityContext must be used within a Provider'
		);
	});

	it('exposes initial selector values and updates via dispatchers', () => {
		const wrapper = createWrapper({ avatarProfile: 'avatar.png' });

		const { result } = renderHook(() => useGlobalUnderTest(), { wrapper });

		// initial values
		expect(result.current.title).toBe('');
		expect(result.current.total).toBe(0);
		expect(result.current.avatar).toBe('avatar.png');
		expect(result.current.link).toBe('');

		// update title
		act(() => {
			result.current.setTitle('Orders');
		});
		expect(result.current.title).toBe('Orders');

		// update total
		act(() => {
			result.current.setTotal(5);
		});
		expect(result.current.total).toBe(5);

		// update avatar
		act(() => {
			result.current.setAvatar('new.png');
		});
		expect(result.current.avatar).toBe('new.png');

		// update link
		act(() => {
			result.current.setLink('/orders/new');
		});
		expect(result.current.link).toBe('/orders/new');
	});

	it('keeps stable dispatcher references across updates', () => {
		const wrapper = createWrapper();
		const { result } = renderHook(() => useGlobalUnderTest(), { wrapper });

		const setTitleRef = result.current.setTitle;
		const setTotalRef = result.current.setTotal;
		const setAvatarRef = result.current.setAvatar;
		const setLinkRef = result.current.setLink;

		act(() => {
			result.current.setTitle('t1');
			result.current.setTotal(1);
			result.current.setAvatar('a1');
			result.current.setLink('/x');
		});

		expect(result.current.setTitle).toBe(setTitleRef);
		expect(result.current.setTotal).toBe(setTotalRef);
		expect(result.current.setAvatar).toBe(setAvatarRef);
		expect(result.current.setLink).toBe(setLinkRef);
	});
});

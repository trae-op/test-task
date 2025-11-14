import {
	getOrderDynamicsHref,
	getOrdersHref,
	getProductsHref,
	getSettingsHref
} from '@/utils/routing/routing';
import { getUserSession } from '@/utils/session';
import { getFullPathUploadPicture } from '@/utils/upload-files';

import styles from './Layout.module.scss';
import { getPictureByEntityId } from '@/actions/pictures/profile';
import { Provider as ActiveSessionsProvider } from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions';
import { LocalizationDropdown } from '@/app/_conceptions/LocalizationDropdown';
import { getProductTypes } from '@/app/_conceptions/Settings/actions/productType/action';
import { ActiveSessionsCounter } from '@/conceptions/ActiveSessionsCounter';
import { AddEntity } from '@/conceptions/AddEntity';
import { FilterProductsWrapper } from '@/conceptions/FilterProducts';
import { Sidebar } from '@/conceptions/Sidebar';
import type { TSidebarNavItem } from '@/conceptions/Sidebar/types';
import { TopHeader } from '@/conceptions/TopHeader.ts';
import { Provider as GlobalProvider } from '@/context/global';

const navigationItems: TSidebarNavItem[] = [
	{ href: getOrdersHref, label: 'Orders' },
	{ href: getProductsHref, label: 'Products' },
	{ href: getOrderDynamicsHref, label: 'Order Dynamics' },
	{ href: getSettingsHref, label: 'Settings' }
];
const BLOCK = 'dashboard';

export default async function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userSession = await getUserSession();

	if (userSession === null) {
		return null;
	}

	const { ok, item } = await getPictureByEntityId(userSession.id);
	const { ok: productTypesOk, items: productTypesItems } =
		await getProductTypes();

	return (
		<div className={styles[BLOCK]}>
			<GlobalProvider
				productTypes={productTypesOk ? productTypesItems : []}
				avatarProfile={
					ok && item?.url
						? getFullPathUploadPicture({
								url: item.url
							})
						: ''
				}
			>
				<TopHeader
					startContentComponent={
						<>
							<ActiveSessionsProvider>
								<ActiveSessionsCounter />
							</ActiveSessionsProvider>
							<LocalizationDropdown className='ms-2 me-2' />
						</>
					}
				/>

				<div className={styles[`${BLOCK}__container`]}>
					<Sidebar items={navigationItems} />
					<div className={styles[`${BLOCK}__content`]}>
						<AddEntity>
							<FilterProductsWrapper />
						</AddEntity>

						{children}
					</div>
				</div>
			</GlobalProvider>
		</div>
	);
}

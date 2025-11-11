import { getUserSession } from '@/utils/session';

import { getPickupLocations } from '@/actions/pickupLocation';
import { getCurrencies } from '@/actions/settings/currency/action';
import { getProductTypes } from '@/actions/settings/productType';
import { CurrencyContainer } from '@/conceptions/Settings/Currency/Container';
import { PickupLocationContainer } from '@/conceptions/Settings/PickupLocation/Container';
import { ProductTypeContainer } from '@/conceptions/Settings/ProductType/Container';
import { Provider as CurrencyProvider } from '@/context/currency';
import { Provider as PickupLocationProvider } from '@/context/pickupLocation';
import { Provider as ProductTypeProvider } from '@/context/productType';

export default async function SettingsPage() {
	const userSession = await getUserSession();
	if (userSession === null) {
		return null;
	}

	const [productTypes, currencies, pickupLocations] = await Promise.all([
		getProductTypes(),
		getCurrencies(),
		getPickupLocations()
	]);

	return (
		<div className='container'>
			<div className='row g-4'>
				<div className='col-12 col-lg-6'>
					<ProductTypeProvider
						items={productTypes.ok ? productTypes.items : []}
					>
						<ProductTypeContainer />
					</ProductTypeProvider>
				</div>

				<div className='col-12 col-lg-6'>
					<CurrencyProvider items={currencies.ok ? currencies.items : []}>
						<CurrencyContainer />
					</CurrencyProvider>
				</div>

				<div className='col-12 col-lg-6'>
					<PickupLocationProvider
						items={pickupLocations.ok ? pickupLocations.items : []}
					>
						<PickupLocationContainer />
					</PickupLocationProvider>
				</div>
			</div>
		</div>
	);
}

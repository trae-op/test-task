import { getUserSession } from '@/utils/session';

import { getPickupLocations } from '@/app/_conceptions/Settings/actions/pickupLocation';
import { getCurrencies } from '@/app/_conceptions/Settings/actions/currency/action';
import { getProductTypes } from '@/app/_conceptions/Settings/actions/productType';
import { CurrencyContainer } from '@/app/_conceptions/Settings/components/Currency/Container';
import { PickupLocationContainer } from '@/app/_conceptions/Settings/components/PickupLocation/Container';
import { ProductTypeContainer } from '@/app/_conceptions/Settings/components/ProductType/Container';
import { Provider as PickupLocationProvider } from '@/app/pickupLocation';
import { Provider as ProductTypeProvider } from '@/a@/context/pickupLocation
import { Provider as CurrencyProvider } from '@/c@/context/productType

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

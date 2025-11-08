'use client';

import clsx from 'clsx';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents
} from 'react-leaflet';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

import { useLocationMap } from '@/hooks/locationMap';

import styles from './LocationMap.module.scss';
import type { TLocationMapProps } from './types';

const iconAssets = {
	iconRetinaUrl:
		typeof markerIcon2x === 'string' ? markerIcon2x : markerIcon2x.src,
	iconUrl: typeof markerIcon === 'string' ? markerIcon : markerIcon.src,
	shadowUrl: typeof markerShadow === 'string' ? markerShadow : markerShadow.src
};

if (typeof window !== 'undefined') {
	L.Icon.Default.mergeOptions(iconAssets);
}

const toLatLngExpression = (coords: {
	lat: number;
	lng: number;
}): LatLngExpression => [coords.lat, coords.lng];

const MapViewUpdater = ({
	center,
	zoom
}: {
	center: LatLngExpression;
	zoom: number;
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
	}, [map, center, zoom]);

	return null;
};

const MapClickHandler = ({
	onClick
}: {
	onClick: (coords: { lat: number; lng: number }) => void;
}) => {
	useMapEvents({
		click: event => {
			onClick({ lat: event.latlng.lat, lng: event.latlng.lng });
		}
	});

	return null;
};

export const LocationMapClient = ({
	onSuccessfulLocation,
	className,
	inputClassName,
	mapClassName,
	initialLocation
}: TLocationMapProps) => {
	const t = useTranslations('App');
	const {
		searchQuery,
		isSearching,
		mapCenter,
		mapZoom,
		markerPosition,
		error,
		handleSearchInput,
		handleSearchSubmit,
		handleMapClick
	} = useLocationMap({ onSuccessfulLocation, initialLocation });

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			handleSearchSubmit();
		},
		[handleSearchSubmit]
	);

	return (
		<div className={clsx(styles['location-map'], className)}>
			<form
				className={styles['location-map__controls']}
				onSubmit={handleSubmit}
			>
				<TextField
					type='text'
					value={searchQuery}
					className='w-100'
					onChange={handleSearchInput}
					placeholder={t('Search for a location', {
						default: 'Search for a location'
					})}
					inputClassName={inputClassName}
				/>
				<Button
					type='submit'
					variant='success'
					text={t('Search', { default: 'Search' })}
					isLoading={isSearching}
					disabled={isSearching}
				/>
			</form>
			{error ? (
				<span className={styles['location-map__error']}>
					{t(error, { default: error })}
				</span>
			) : null}
			<MapContainer
				center={toLatLngExpression(mapCenter)}
				zoom={mapZoom}
				scrollWheelZoom
				className={clsx(styles['location-map__map'], mapClassName)}
			>
				<MapViewUpdater center={toLatLngExpression(mapCenter)} zoom={mapZoom} />
				<MapClickHandler onClick={handleMapClick} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{markerPosition ? (
					<Marker position={toLatLngExpression(markerPosition)} />
				) : null}
			</MapContainer>
		</div>
	);
};

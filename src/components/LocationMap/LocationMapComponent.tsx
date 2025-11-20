'use client';

import clsx from 'clsx';
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import {
	MapContainer,
	Marker,
	Polygon,
	TileLayer,
	useMap,
	useMapEvents
} from 'react-leaflet';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

import { useLocationMap } from '@/hooks/locationMap';

import {
	UKRAINE_MASK_POLYGON,
	UKRAINE_POLYGON,
	isPointInUkraine
} from '@/utils/map';

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

const UKRAINE_BOUNDS: LatLngBoundsExpression = [
	[44.02, 22.13],
	[52.38, 40.22]
];

const toLatLngExpression = (coords: {
	lat: number;
	lng: number;
}): LatLngExpression => [coords.lat, coords.lng];

const isValidCoords = (
	coords?: { lat: number; lng: number } | null
): coords is { lat: number; lng: number } =>
	Boolean(coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng));

const MapViewUpdater = ({
	center,
	zoom
}: {
	center: LatLngExpression;
	zoom: number;
}) => {
	const map = useMap();

	useEffect(() => {
		let lat: number | undefined;
		let lng: number | undefined;
		if (Array.isArray(center)) {
			lat = Number(center[0]);
			lng = Number(center[1]);
		} else if (typeof center === 'object' && center !== null) {
			lat = Number(center.lat);
			lng = Number(center.lng);
		}

		if (
			Number.isFinite(lat) &&
			Number.isFinite(lng) &&
			Number.isFinite(Number(zoom))
		) {
			map.setView([lat as number, lng as number], zoom);
		}
	}, [map, center, zoom]);

	return null;
};

const MapClickHandler = ({
	onClick
}: {
	onClick: (params: {
		coords: { lat: number; lng: number };
		zoom: number;
	}) => void | Promise<void>;
}) => {
	const map = useMapEvents({
		click: event => {
			void onClick({
				coords: { lat: event.latlng.lat, lng: event.latlng.lng },
				zoom: map.getZoom()
			});
		}
	});

	return null;
};

const ErrorMessage = ({ error }: { error?: string }) => {
	const t = useTranslations('App');

	if (!error) {
		return null;
	}

	const normalizedKey = error.startsWith('App.') ? error.slice(4) : error;
	const translated = t(normalizedKey, { default: normalizedKey });

	return <span className={styles['location-map__error']}>{translated}</span>;
};

export const LocationMapComponent = ({
	onSuccessfulLocation,
	className,
	inputClassName,
	mapClassName,
	initialLocation,
	showSearchControls = true,
	isInteractive = true
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

	const fallbackCenter = isValidCoords(initialLocation)
		? { lat: initialLocation.lat, lng: initialLocation.lng }
		: { lat: 0, lng: 0 };
	const lastValidCenterRef = useRef<{ lat: number; lng: number }>(
		isValidCoords(mapCenter) ? mapCenter : fallbackCenter
	);

	useEffect(() => {
		if (isValidCoords(mapCenter)) {
			lastValidCenterRef.current = mapCenter;
		}
	}, [mapCenter]);

	const safeMapCenter = isValidCoords(mapCenter)
		? mapCenter
		: lastValidCenterRef.current;
	const isMarkerValid = isValidCoords(markerPosition);
	const derivedError =
		error ??
		(!isValidCoords(mapCenter)
			? 'Unable to determine map location'
			: undefined);

	const shouldRenderSearchControls = showSearchControls !== false;
	const isLocationInteractive = isInteractive !== false;

	const handleRestrictedMapClick = useCallback(
		(params: { coords: { lat: number; lng: number }; zoom: number }) => {
			if (isPointInUkraine(params.coords)) {
				handleMapClick(params);
			}
		},
		[handleMapClick]
	);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!isLocationInteractive) {
				return;
			}
			handleSearchSubmit();
		},
		[handleSearchSubmit, isLocationInteractive]
	);

	return (
		<div className={clsx(styles['location-map'], className)}>
			{shouldRenderSearchControls ? (
				<form
					className={styles['location-map__controls']}
					onSubmit={handleSubmit}
				>
					<TextField
						type='text'
						value={searchQuery}
						className='w-100'
						onChange={isLocationInteractive ? handleSearchInput : undefined}
						placeholder={t('Search for a location', {
							default: 'Search for a location'
						})}
						inputClassName={inputClassName}
						disabled={!isLocationInteractive}
					/>
					<Button
						type='submit'
						variant='success'
						text={t('Search', { default: 'Search' })}
						isLoading={isLocationInteractive ? isSearching : false}
						disabled={!isLocationInteractive || isSearching}
					/>
				</form>
			) : null}
			<ErrorMessage error={derivedError} />
			<MapContainer
				center={toLatLngExpression(safeMapCenter)}
				zoom={mapZoom}
				scrollWheelZoom
				className={clsx(styles['location-map__map'], mapClassName)}
				maxBounds={UKRAINE_BOUNDS}
				maxBoundsViscosity={1.0}
				minZoom={5}
			>
				<MapViewUpdater
					center={toLatLngExpression(safeMapCenter)}
					zoom={mapZoom}
				/>
				{isLocationInteractive ? (
					<MapClickHandler onClick={handleRestrictedMapClick} />
				) : null}
				<Polygon
					positions={UKRAINE_MASK_POLYGON}
					pathOptions={{
						color: 'transparent',
						fillColor: '#3388ff',
						fillOpacity: 0.25
					}}
					interactive={false}
				/>
				<Polygon
					positions={UKRAINE_POLYGON}
					pathOptions={{ color: '#3388ff', weight: 2, fillOpacity: 0 }}
					interactive={false}
				/>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{isMarkerValid ? (
					<Marker position={toLatLngExpression(markerPosition)} />
				) : null}
			</MapContainer>
		</div>
	);
};

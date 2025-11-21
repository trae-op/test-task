'use client';

import {
	BarElement,
	CategoryScale,
	type ChartData,
	type ChartDataset,
	Chart as ChartJS,
	type ChartOptions,
	Legend,
	LinearScale,
	Tooltip
} from 'chart.js';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';

import { EmptyData } from '@/components/EmptyData';
import { Loading } from '@/components/Loading';

import { buildOrderDynamicsSeries } from '@/utils/orderDynamics';

import styles from '../styles/OrderDynamics.module.scss';
import type { TOrderDynamicsProps } from '../types';

const BLOCK = 'order-dynamics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = dynamic(
	() => import('react-chartjs-2').then(module => module.Bar),
	{
		ssr: false,
		loading: () => (
			<div
				className={clsx(
					styles[`${BLOCK}__image-upload`],
					'd-flex align-items-center justify-content-center w-100'
				)}
			>
				<Loading />
			</div>
		)
	}
);

const CHART_OPTIONS: ChartOptions<'bar'> = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			ticks: {
				color: 'var(--color-muted)'
			},
			grid: {
				display: false
			}
		},
		counts: {
			type: 'linear',
			position: 'left',
			beginAtZero: true,
			border: {
				dash: [4, 4]
			},
			grid: {
				color: 'rgba(0, 0, 0, 0.05)'
			},
			ticks: {
				stepSize: 1,
				precision: 0,
				color: 'var(--color-muted)'
			}
		},
		amount: {
			type: 'linear',
			position: 'right',
			beginAtZero: true,
			grid: {
				drawOnChartArea: false
			},
			ticks: {
				color: 'var(--color-muted)'
			}
		}
	},
	plugins: {
		legend: {
			display: true,
			position: 'bottom',
			labels: {
				color: 'var(--color-muted)'
			}
		},
		tooltip: {
			mode: 'index',
			intersect: false
		}
	}
};

const EMPTY_KEY = 'No orders available';
const CURRENCY_COLORS = [
	'rgba(255, 193, 7, 0.6)',
	'rgba(255, 99, 132, 0.6)',
	'rgba(153, 102, 255, 0.6)',
	'rgba(54, 162, 235, 0.6)',
	'rgba(201, 203, 207, 0.6)',
	'rgba(75, 192, 192, 0.6)'
];

const createCountDataset = (
	label: string,
	data: number[],
	backgroundColor: string,
	borderColor: string
): ChartDataset<'bar'> => ({
	label,
	data,
	backgroundColor,
	borderColor,
	borderWidth: 1,
	borderRadius: 6,
	maxBarThickness: 42,
	yAxisID: 'counts'
});

const createAmountDataset = (
	label: string,
	data: number[],
	backgroundColor: string
): ChartDataset<'bar'> => ({
	label,
	data,
	backgroundColor,
	borderColor: backgroundColor,
	borderWidth: 1,
	borderRadius: 6,
	maxBarThickness: 42,
	yAxisID: 'amount',
	stack: 'amount'
});

export const OrderDynamicsChart = memo(({ orders }: TOrderDynamicsProps) => {
	const locale = useLocale();
	const t = useTranslations('App');
	const {
		labels,
		orders: ordersSeries,
		products: productsSeries,
		totalsByCurrency
	} = useMemo(
		() => buildOrderDynamicsSeries({ orders, locale }),
		[orders, locale]
	);

	const hasCurrencyData = Object.values(totalsByCurrency).some(series =>
		series.some(value => value > 0)
	);
	const hasData =
		labels.length > 0 &&
		(ordersSeries.some(value => value > 0) ||
			productsSeries.some(value => value > 0) ||
			hasCurrencyData);

	const chartData = useMemo<ChartData<'bar'>>(() => {
		const datasets: ChartDataset<'bar'>[] = [
			createCountDataset(
				t('Orders'),
				ordersSeries,
				'rgba(92, 184, 92, 0.6)',
				'rgba(92, 184, 92, 1)'
			),
			createCountDataset(
				t('Products'),
				productsSeries,
				'rgba(2, 117, 216, 0.5)',
				'rgba(2, 117, 216, 1)'
			)
		];

		Object.entries(totalsByCurrency).forEach(([symbol, values], index) => {
			if (values.every(value => value === 0)) {
				return;
			}
			const color = CURRENCY_COLORS[index % CURRENCY_COLORS.length];
			datasets.push(
				createAmountDataset(`${symbol} ${t('Amount')}`, values, color)
			);
		});

		return {
			labels,
			datasets
		};
	}, [labels, ordersSeries, productsSeries, totalsByCurrency, t]);

	if (!hasData) {
		return <EmptyData text={EMPTY_KEY} />;
	}

	return (
		<div className={styles[`${BLOCK}`]}>
			<div className={styles[`${BLOCK}__chart`]}>
				<BarChart data={chartData} options={CHART_OPTIONS} />
			</div>
		</div>
	);
});

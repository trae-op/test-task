export type TCheckPathnameConfig<T = unknown> = {
	// Note: keeping the property name as requested in the spec
	pathname: string;
	fetch: () => Promise<T[]>;
};

export type TCheckPathnamesResult = {
	href: string;
	displayTitle: string;
	displayTotal: number;
	currentPathname: string;
};

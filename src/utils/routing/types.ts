export type TCreateParamsInput = {
	id?: string | number;
	type?: string;
	fields?: Array<string | Record<string, string[]>>;
};

export type TParseQueryParamsInput = {
	[key: string]:
		| boolean
		| {
				select?: TParseQueryParamsInput;
		  };
};

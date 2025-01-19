export const datesToNumbers = <
	T extends Record<string, any>,
	DK extends keyof T,
>(
	obj: T,
	dateKeys: DK[] | ReadonlyArray<DK>,
): Omit<T, DK> & { [K in DK]: number } => {
	const result = { ...obj }
	for (const key of dateKeys) {
		if (
			typeof obj[key as keyof T] === 'object' &&
			(obj[key] as any) instanceof Date
		) {
			// @ts-expect-error
			result[key] = Math.floor((obj[key as keyof T] as Date).getTime() / 1000)
		}
	}
	return result
}

export type StringsToDates<
	T extends Record<string, any>,
	DateKeys extends keyof T,
> = {
	[K in keyof T]: K extends DateKeys ? Date : T[K]
}

export const stringsOrNumbersToDates = <
	T extends Record<string, any>,
	DK extends keyof T,
>(
	obj: T,
	keys: DK[] | ReadonlyArray<DK>,
): Omit<T, DK> & { [K in DK]: Date } => {
	const result = { ...obj }
	for (const key of keys) {
		if (typeof result[key] === 'number') {
			// @ts-expect-error
			result[key] = new Date(result[key] * 1000)
		}
		if (typeof result[key] === 'string') {
			// @ts-expect-error
			result[key] = new Date(result[key])
		}
	}
	return result
}

export type StringsOrNumbersToBooleans<
	T extends Record<string, any>,
	BooleanKeys extends keyof T,
> = {
	[K in keyof T]: K extends BooleanKeys ? boolean : T[K]
}

export const stringsOrNumbersToBooleans = <
	T extends Record<string, any>,
	DK extends keyof T,
>(
	obj: T,
	keys: DK[] | ReadonlyArray<DK>,
): Omit<T, DK> & { [K in DK]: boolean } => {
	const result = { ...obj }
	for (const key of keys) {
		if (typeof result[key] === 'string' || typeof result[key] === 'number') {
			// @ts-expect-error
			result[key] =
				result[key] === 'true' || result[key] === '1' || result[key] === 1
		}
	}
	return result
}

export type StringsToNumbers<
	T extends Record<string, any>,
	NumberKeys extends keyof T,
> = {
	[K in keyof T]: K extends NumberKeys ? number : T[K]
}

export const stringsToNumbers = <
	T extends Record<string, any>,
	NumberKeys extends keyof T,
>(
	obj: T,
	keys: NumberKeys[] | ReadonlyArray<NumberKeys>,
): Omit<T, NumberKeys> & { [K in NumberKeys]: number } => {
	const result = { ...obj }
	for (const key of keys) {
		if (typeof result[key] === 'string') {
			// @ts-expect-error
			result[key] = Number(result[key])
		}
	}
	return result
}

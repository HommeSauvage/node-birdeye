import type { Problem } from './problem'

export class Err<E, M = unknown> {
	static readonly EMPTY = new Err<void>(undefined)

	readonly ok = false
	readonly err = true

	constructor(
		public readonly val: E,
		public readonly metadata?: M,
	) {}
}

export class Ok<T, M = unknown> {
	static readonly EMPTY = new Ok<void>(undefined)

	readonly ok = true
	readonly err = false

	constructor(
		public readonly val: T,
		public readonly metadata?: M,
	) {}
}

export type Result<T, E, MS = unknown, ME = MS> = Ok<T, MS> | Err<E, ME>

export type ResultOkType<T extends Result<any, any>> = T extends Result<
	infer U,
	any
>
	? U
	: never
export type ResultErrType<T extends Result<any, any>> = T extends Result<
	any,
	infer U
>
	? U
	: never

export type StandardResult<R = unknown, MS = unknown, ME = MS> = Result<
	R,
	Problem,
	MS,
	ME
>
export type PromisedResult<R = unknown, MS = unknown, ME = MS> = Promise<
	StandardResult<R, MS, ME>
>

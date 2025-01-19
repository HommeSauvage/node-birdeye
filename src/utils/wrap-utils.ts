import { PROBLEM_UNKNOWN, isAProblem, makeProblem } from './problem'
import { Err, Ok, type Result } from './result'

type AsyncFunction = (...args: any[]) => Promise<any>
type SyncFunction = (...args: any[]) => any

export type AddThrowVariant<T> = {
	[K in keyof T as K extends string
		? `${K}OrThrow`
		: never]: T[K] extends AsyncFunction
		? (
				...args: Parameters<T[K]>
			) => Promise<
				Awaited<ReturnType<T[K]>> extends Result<infer U, any>
					? U
					: ReturnType<T[K]>
			>
		: T[K] extends SyncFunction
			? (
					...args: Parameters<T[K]>
				) => ReturnType<T[K]> extends Result<infer U, any>
					? U
					: ReturnType<T[K]>
			: T[K]
} & T

export class ErrorWithResult extends Error {
	constructor(public readonly result: Result<any, any>) {
		const problem = isAProblem(result.val)
			? result.val
			: makeProblem(PROBLEM_UNKNOWN, 'Unknown problem', {
					original: result.val,
				})
		super(problem.message || problem.code)
	}
}

export function wrapWithThrow<T extends object>(
	instance: T,
): AddThrowVariant<T> {
	return new Proxy(instance, {
		get(target, prop, receiver) {
			// If prop ends with "OrThrow", handle the method with error throwing logic
			if (typeof prop === 'string' && prop.endsWith('OrThrow')) {
				const originalMethodName = prop.slice(0, -7)
				const originalMethod = target[originalMethodName as keyof typeof target]

				if (typeof originalMethod === 'function') {
					return async (...args: unknown[]) => {
						const result = await Reflect.apply(originalMethod, target, args)
						if (result instanceof Ok) {
							return result.val
						}
						if (result instanceof Err) {
							throw new ErrorWithResult(result.val)
						}
						return result
					}
				}
			}

			// Otherwise, retrieve the real property from the target
			const originalProp = Reflect.get(target, prop, receiver)

			// If it's a function, return a function bound to 'target'
			if (typeof originalProp === 'function') {
				return (...args: unknown[]) => {
					return Reflect.apply(originalProp, target, args)
				}
			}

			// If it's not a function, just return it
			return originalProp
		},
	}) as AddThrowVariant<T>
}

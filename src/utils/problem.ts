export interface Problem {
	object: 'problem'
	code: string
	statusCode?: number
	message?: string
	metadata?: Record<string, any>
}

/**
 * code 400
 * Use this when the request is invalid
 */
export const PROBLEM_BAD_REQUEST = 'bad_request'

/**
 * code 401
 * Unauthorizaed access (needs api key)
 */
export const PROBLEM_UNAUTHORIZED = 'unauthorized'

/**
 * code 403
 * Forbidden access (api key doesn't have permission)
 */
export const PROBLEM_FORBIDDEN = 'forbidden'

/**
 * code 404
 * This problem code is used when a resource is not found
 */
export const PROBLEM_NOT_FOUND = 'not_found'

/**
 * code 422
 * Validation failed, usually with POST
 */
export const PROBLEM_UNPROCESSABLE = 'unprocessable'

/**
 * code 429
 * This problem code is used when there's a rate limit exceeded
 */
export const PROBLEM_RATE_LIMIT = 'rate_limit'

/**
 * code 500
 * External error, could be a problem with the server or the API
 */
export const PROBLEM_EXTERNAL = 'external'

/**
 * code 500
 * Could not connect to the server
 */
export const PROBLEM_NETWORK_ERROR = 'network_error'

/**
 * code 500
 * Could not parse the response
 */
export const PROBLEM_INVALID_RESPONSE = 'invalid_response'

/**
 * code 500
 * Unknown problem
 */
export const PROBLEM_UNKNOWN = 'unknown'

export const isAProblem = (problem: any): problem is Problem => {
	return (
		typeof problem === 'object' &&
		problem &&
		typeof problem.code === 'string' &&
		problem.object === 'problem'
	)
}

/**
 * When using makeProblem(Problem), no automatic processing will happen, it will be returned as is
 * @param problem
 */
export function makeProblem(problem: Problem | Omit<Problem, 'object'>): Problem
export function makeProblem(
	code: string,
	message: string,
	statusCode?: number,
): Problem
export function makeProblem(
	code: string,
	message: string,
	metadata?: Record<string, any>,
): Problem
export function makeProblem(
	code: string | Problem | Omit<Problem, 'object'>,
	message?: string,
	statusCode?: Record<string, any> | number,
): Problem {
	// makeProblem(problem: Problem)
	if (isAProblem(code)) {
		if (!code.statusCode) {
			return {
				...code,
				statusCode: getSuitableStatusForCode(code.code),
			}
		}
		return code
	}

	let newProblem: Problem = {
		object: 'problem',
		code: PROBLEM_EXTERNAL,
	}

	if (typeof code === 'string') {
		newProblem.code = code
		if (typeof message === 'string') {
			newProblem.message = message
		}
		if (typeof statusCode === 'number') {
			newProblem.statusCode = statusCode
		}
		if (typeof statusCode === 'object') {
			newProblem.metadata = statusCode
		}
	} else if ('code' in code) {
		newProblem = {
			object: 'problem',
			...code,
		}
	}

	return {
		...newProblem,
		statusCode:
			newProblem.statusCode || getSuitableStatusForCode(newProblem.code),
	}
}

const CODE_STATUS_MAP = {
	[PROBLEM_BAD_REQUEST]: 400,
	[PROBLEM_UNAUTHORIZED]: 401,
	[PROBLEM_FORBIDDEN]: 403,
	[PROBLEM_NOT_FOUND]: 404,
	[PROBLEM_UNPROCESSABLE]: 422,
	[PROBLEM_RATE_LIMIT]: 429,
	[PROBLEM_NETWORK_ERROR]: 500,
	[PROBLEM_EXTERNAL]: 500,
}

export const getSuitableStatusForCode = (code: string) => {
	return code in CODE_STATUS_MAP
		? CODE_STATUS_MAP[code as keyof typeof CODE_STATUS_MAP]
		: 500
}

export const getCodeForStatus = (status: number) => {
	return (
		Object.keys(CODE_STATUS_MAP).find(
			(code) =>
				CODE_STATUS_MAP[code as keyof typeof CODE_STATUS_MAP] === status,
		) ?? PROBLEM_EXTERNAL
	)
}

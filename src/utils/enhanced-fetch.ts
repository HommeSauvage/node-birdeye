import {
	PROBLEM_INVALID_RESPONSE,
	PROBLEM_NETWORK_ERROR,
	type Problem,
	makeProblem,
} from './problem'
import { Err, Ok, type Result } from './result'

type EnhancedRequestInit = Omit<RequestInit, 'body'> & {
	body?: RequestInit['body'] | object
}

export type FetchMetadata = {
	headers: Response['headers']
	status: Response['status']
}

export type EnhandedFetchResult<S, E = Problem> = Result<
	S,
	E | Problem,
	FetchMetadata,
	FetchMetadata
>

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  response   A response from a network request
 *
 * @return Returns either the response, or throws an error
 */
const isSuccessful = (response: Response) => {
	return response.status >= 200 && response.status < 300
}

/**
 * Requests a URL, returning a promise
 *
 * @param  url       The URL we want to request
 * @param [options] The options we want to pass to "fetch"
 *
 * @return          The response data
 */
export const enhancedFetch = async <S = object, E = Problem>(
	url: string,
	providedOptions?: EnhancedRequestInit,
): Promise<EnhandedFetchResult<S, E | Problem>> => {
	const { body, ...rest } = providedOptions || {}
	const options: RequestInit = {
		...rest,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			Accept: 'application/json',
			...rest?.headers,
		},
	}
	let finalBody = body
	if (finalBody && typeof finalBody !== 'string') {
		finalBody = JSON.stringify(finalBody)
	}
	options.body = finalBody

	let response: Response
	try {
		response = await fetch(url, options)
	} catch (e: any) {
		return new Err(
			makeProblem({
				code: PROBLEM_NETWORK_ERROR,
				message: e.message,
				metadata: {
					url,
					providedOptions,
				},
			}),
		)
	}

	const metadata: FetchMetadata = {
		headers: response.headers,
		status: response.status,
	}

	let responseBody: S | E | null

	// Will parse JSON body regardless of the response status
	const textBody = await response.text()

	try {
		responseBody = await JSON.parse(textBody)
	} catch (e: any) {
		if (response.status > 200 && response.status < 206) {
			responseBody = null
		} else {
			return new Err(
				makeProblem({
					code: PROBLEM_INVALID_RESPONSE,
					message: 'Unable to parse json',
					statusCode: response.status,
					metadata: {
						response: {
							status: response.status,
							statusTest: response.statusText,
							body: textBody,
						},
					},
				}),
				metadata,
			)
		}
	}

	// We return the body as E if the fetch is not successful
	if (!isSuccessful(response)) {
		return new Err(responseBody as E, metadata)
	}

	// We return the body as S if the fetch is successful
	return new Ok(responseBody as S, metadata)
}

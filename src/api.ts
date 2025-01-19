import type { Chain } from './constants'
import {
	type EnhandedFetchResult,
	type FetchMetadata,
	enhancedFetch,
} from './utils/enhanced-fetch'
import {
	PROBLEM_EXTERNAL,
	type Problem,
	getCodeForStatus,
	isAProblem,
	makeProblem,
} from './utils/problem'
import { Err } from './utils/result'

export type StandardApiParams = {
	/**
	 * @default 'solana'
	 */
	chain?: Chain | null
}

export type StandardApiParamsWithAllChains = Omit<
	StandardApiParams,
	'chain'
> & {
	chain?: StandardApiParams['chain'] | 'all'
}

type QueryParamValue =
	| string
	| number
	| boolean
	| Array<string | number>
	| undefined

interface FetchParams extends StandardApiParamsWithAllChains {
	/**
	 * Do not include a trailing slash
	 */
	baseUrl?: string
	method?: 'GET' | 'POST'
	queryParams?: Record<string, QueryParamValue>
	body?: Record<string, any>
}

export class Api<DefaultChain extends Chain = 'solana'> {
	private baseUrl = 'https://public-api.birdeye.so'
	private defaultChain: Chain
	private readonly apiKey: string

	constructor(apiKey: string, defaultChain?: DefaultChain, baseUrl?: string) {
		this.apiKey = apiKey
		this.defaultChain = (defaultChain ?? 'solana') as DefaultChain
		this.baseUrl = baseUrl ?? this.baseUrl
	}

	private formatQueryValue = (value: NonNullable<QueryParamValue>): string => {
		const type = Array.isArray(value) ? 'array' : typeof value
		switch (type) {
			case 'array':
				return (value as Extract<QueryParamValue, Array<any>>).join(',')
			case 'boolean':
				return value ? 'true' : 'false'
			default:
				return String(value)
		}
	}

	private createSearchParams(
		params: Record<string, QueryParamValue>,
	): URLSearchParams {
		const searchParams = new URLSearchParams()
		const entries = Object.entries(params)
		let i = entries.length

		while (i--) {
			const [key, value] = entries[i]
			if (value != null && value !== undefined) {
				searchParams.append(key, this.formatQueryValue(value))
			}
		}

		return searchParams
	}

	async fetch<T>(
		path: string,
		params?: FetchParams,
	): Promise<EnhandedFetchResult<T, { success: false; message: string }>> {
		const baseUrl = params?.baseUrl ?? this.baseUrl

		const body = params?.body
		const queryParams = params?.queryParams
			? this.createSearchParams(params.queryParams)
			: undefined
		const query = queryParams ? `?${queryParams.toString()}` : ''

		const chainHeader: HeadersInit =
			params?.chain !== null
				? {
						'x-chain': params?.chain ?? this.defaultChain,
					}
				: {}

		const result = await enhancedFetch<T, { success: false; message: string }>(
			`${baseUrl}${path}${query}`,
			{
				method: params?.method ?? 'GET',
				headers: {
					'X-API-KEY': this.apiKey,
					...chainHeader,
				},
				body,
			},
		)

		if (result.ok && !(result.val as any).success) {
			return new Err<Problem, FetchMetadata>(
				makeProblem(
					PROBLEM_EXTERNAL,
					(result.val as any).message ?? 'Unknown error',
				),
				result.metadata,
			)
		}

		if (result.err && !isAProblem(result.val)) {
			return new Err<Problem, FetchMetadata>(
				makeProblem(
					getCodeForStatus(result.metadata?.status || 500),
					result.val.message,
				),
				result.metadata,
			)
		}

		return result
	}

	setBaseUrl(url: string) {
		this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
	}

	getDefaultChain() {
		return this.defaultChain
	}
}

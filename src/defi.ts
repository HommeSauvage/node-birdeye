import type { Api, StandardApiParams } from './api'
import type {
	ByTimeParams,
	DefiOHLCVByBaseQuoteData,
	DefiOHLCVData,
	DefiOHLCVParams,
	DefiPriceHistoricalByUnixTimestampParams,
	DefiPriceHistoricalByUnixTimestampResponse,
	DefiPriceHistoricalParams,
	DefiPriceHistoricalResponse,
	DefiPriceMultiVolumeResponse,
	DefiPriceMultipleParams,
	DefiPriceMultipleResponse,
	DefiPriceParams,
	DefiPriceResponse,
	DefiPriceResponseRaw,
	DefiPriceVolumeMultiParams,
	DefiPriceVolumeParams,
	DefiPriceVolumeResponse,
	DefiTradesParams,
	DefiTradesResponse,
	WithTimeParams,
} from './defi.types'
import { datesToNumbers, stringsOrNumbersToDates } from './utils/converters'
import { Ok, type PromisedResult } from './utils/result'
import type { ListResponse } from './utils/types'
import { wrapWithThrow } from './utils/wrap-utils'

export type Defi = ReturnType<typeof createDefi>

class DefiFetcher {
	#base = '/defi'
	readonly api: Api

	constructor(api: Api) {
		this.api = api
	}

	/**
	 * Get a list of all supported networks.
	 */
	async supportedNetworks(): PromisedResult<Array<string>> {
		const result = await this.api.fetch<{ data: Array<string> }>(
			`${this.#base}/networks`,
		)
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get price update of a token.
	 */
	async price(
		params: DefiPriceParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceResponse> {
		const result = await this.api.fetch<{ data: DefiPriceResponseRaw | null }>(
			`${this.#base}/price`,
			{
				...apiParams,
				queryParams: params,
			},
		)
		if (result.err) {
			return result
		}

		return new Ok(
			result.val.data
				? stringsOrNumbersToDates(result.val.data, ['updateHumanTime'])
				: null,
		)
	}

	/**
	 * Get price updates of multiple tokens in a single API call. Maximum 100 tokens
	 */
	async priceMultiple(
		params: DefiPriceMultipleParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceMultipleResponse> {
		const result = await this.api.fetch<{
			data: { [key: string]: DefiPriceResponseRaw }
		}>(`${this.#base}/multi_price`, {
			...apiParams,
			body: params,
		})
		if (result.err) {
			return result
		}

		return new Ok(
			Object.fromEntries(
				Object.entries(result.val.data).map(([key, value]) => [
					key,
					value ? stringsOrNumbersToDates(value, ['updateHumanTime']) : null,
				]),
			),
		)
	}

	/**
	 * Get historical price line chart of a token.
	 */
	async priceHistorical(
		params: DefiPriceHistoricalParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceHistoricalResponse> {
		const result = await this.api.fetch<{
			data: DefiPriceHistoricalResponse
		}>(`${this.#base}/history_price`, {
			...apiParams,
			queryParams: datesToNumbers(
				{
					address_type: 'token',
					type: '15m',
					...params,
				},
				['time_from', 'time_to'],
			),
		})
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get historical price by unix timestamp
	 */
	async priceHistoricalByUnixTimestamp(
		params: DefiPriceHistoricalByUnixTimestampParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceHistoricalByUnixTimestampResponse> {
		const result = await this.api.fetch<{
			data: DefiPriceHistoricalByUnixTimestampResponse
		}>(`${this.#base}/historical_price_unix`, {
			...apiParams,
			queryParams: datesToNumbers(params, ['unixtime']),
		})
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get list of trades of a certain token.
	 */
	private async trades(
		apiType: '/token' | '/token/seek_by_time' | '/pair' | '/pair/seek_by_time',
		params: DefiTradesParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiTradesResponse> {
		const result = await this.api.fetch<{
			data: DefiTradesResponse
		}>(`${this.#base}/txs${apiType}`, {
			...apiParams,
			queryParams: datesToNumbers(
				{
					limit: 50,
					tx_type: 'swap',
					...params,
				} as Extract<DefiTradesParams, ByTimeParams>,
				['after_time', 'before_time'],
			),
		})
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get list of trades of a certain token.
	 * Pass sort_type to call /token, otherwise, it will call /token/seek_by_time
	 */
	async tradesByToken(
		params: DefiTradesParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiTradesResponse> {
		return await this.trades(
			'sort_type' in params ? '/token' : '/token/seek_by_time',
			{
				sort_type: 'desc',
				...params,
			},
			apiParams,
		)
	}

	/**
	 * Get list of trades of a certain pair.
	 * Pass sort_type to call /pair, otherwise, it will call /pair/seek_by_time
	 */
	async tradesByPair(
		params: DefiTradesParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiTradesResponse> {
		return await this.trades(
			'sort_type' in params ? '/pair' : '/pair/seek_by_time',
			{
				sort_type: 'desc',
				...params,
			},
			apiParams,
		)
	}

	/**
	 * Get OHLCV price of a token. Maximum 1000 records returned.
	 * Pass the type as 'pair' to get OHLCV price of a token based on the pair
	 * address and 'token' to get OHLCV price of a token based on the token address
	 */
	async ohlcv<P extends DefiOHLCVParams>(
		{ address_type, ...params }: P,
		apiParams?: StandardApiParams,
	): PromisedResult<
		ListResponse<
			P extends { address_type: 'base_quote' }
				? DefiOHLCVByBaseQuoteData
				: DefiOHLCVData
		>
	> {
		const extention =
			(!address_type || address_type) === 'token' ? '' : `/${address_type}`

		const result = await this.api.fetch<{
			data: ListResponse<DefiOHLCVData>
		}>(`${this.#base}/ohlcv${extention}`, {
			...apiParams,
			queryParams: datesToNumbers(
				{
					type: '15m',
					...params,
				} as Extract<P, WithTimeParams>,
				['time_from', 'time_to'],
			),
		})
		if (result.err) {
			return result
		}
		return new Ok(
			result.val.data as ListResponse<
				P extends { address_type: 'base_quote' }
					? DefiOHLCVByBaseQuoteData
					: DefiOHLCVData
			>,
		)
	}

	/**
	 * Get price and volume updates of a token
	 */
	async priceVolume(
		params: DefiPriceVolumeParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceVolumeResponse> {
		const result = await this.api.fetch<{
			data: DefiPriceVolumeResponse
		}>(`${this.#base}/price_volume/single`, {
			...apiParams,
			queryParams: {
				type: '24h',
				...params,
			},
		})
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get price and volume updates. Maximum 50 tokens
	 */
	async priceVolumeMulti(
		params: DefiPriceVolumeMultiParams,
		apiParams?: StandardApiParams,
	): PromisedResult<DefiPriceMultiVolumeResponse> {
		const result = await this.api.fetch<{
			data: DefiPriceMultiVolumeResponse
		}>(`${this.#base}/price_volume/multi`, {
			...apiParams,
			body: {
				type: '24h',
				...params,
			},
			method: 'POST',
		})
		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}
}

export const createDefi = (
	...params: ConstructorParameters<typeof DefiFetcher>
) => wrapWithThrow(new DefiFetcher(...params))

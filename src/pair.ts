import type { Api, PromisedApiResult, StandardApiParams } from './api'
import {
	type StringsToDates,
	stringsOrNumbersToDates,
} from './utils/converters'
import { Ok } from './utils/result'
import { wrapWithThrow } from './utils/wrap-utils'

export type Pair = ReturnType<typeof createPair>
type PairOverviewParams = {
	address: string
}

export type PairOverviewMultipleParams = {
	list_addresses: string[]
}

interface TokenInfo {
	address: string
	decimals: number
	icon: string | null
	symbol: string
}

type PairOverviewResponseRaw = {
	address: string
	base: TokenInfo
	created_at: string
	name: string
	quote: TokenInfo
	source: string
	liquidity: number
	liquidity_change_percentage_24h: number | null
	price: number
	trade_24h: number | null
	trade_24h_change_percent: number | null
	unique_wallet_24h: number | null
	unique_wallet_24h_change_percent: number | null
	volume_24h: number | null
	volume_24h_change_percentage_24h: number | null
	trade_1h: number | null
	trade_1h_change_percent: number | null
	trade_30m: number | null
	trade_30m_change_percent: number | null
	trade_history_1h: number | null
	trade_history_30m: number | null
	trade_12h: number | null
	trade_12h_change_percent: number | null
	trade_2h: number | null
	trade_2h_change_percent: number | null
	trade_4h: number | null
	trade_4h_change_percent: number | null
	trade_8h: number | null
	trade_8h_change_percent: number | null
	trade_history_12h: number | null
	trade_history_2h: number | null
	trade_history_4h: number | null
	trade_history_8h: number | null
	unique_wallet_12h: number | null
	unique_wallet_12h_change_percent: number | null
	unique_wallet_1h: number | null
	unique_wallet_1h_change_percent: number | null
	unique_wallet_2h: number | null
	unique_wallet_2h_change_percent: number | null
	unique_wallet_30m: number | null
	unique_wallet_30m_change_percent: number | null
	unique_wallet_4h: number | null
	unique_wallet_4h_change_percent: number | null
	unique_wallet_8h: number | null
	unique_wallet_8h_change_percent: number | null
	volume_12h: number | null
	volume_12h_change_percent: number | null
	volume_1h: number | null
	volume_1h_change_percent: number | null
	volume_2h: number | null
	volume_2h_change_percent: number | null
	volume_30m: number | null
	volume_30m_change_percent: number | null
	volume_4h: number | null
	volume_4h_change_percent: number | null
	volume_8h: number | null
	volume_8h_change_percent: number | null
	volume_12h_quote: number | null
	volume_1h_quote: number | null
	volume_2h_quote: number | null
	volume_30m_quote: number | null
	volume_4h_quote: number | null
	volume_8h_quote: number | null
	volume_12h_base: number | null
	volume_1h_base: number | null
	volume_2h_base: number | null
	volume_30m_base: number | null
	volume_4h_base: number | null
	volume_8h_base: number | null
}

export type PairOverviewResponse = StringsToDates<
	PairOverviewResponseRaw,
	'created_at'
>

type PairOverviewMultipleResponseRaw = {
	[key: string]: PairOverviewResponseRaw
}

export type PairOverviewMultipleResponse = {
	[key: string]: PairOverviewResponse
}

class PairFetcher {
	#base = '/defi/v3/pair'
	private readonly api: Api
	constructor(api: Api) {
		this.api = api
	}

	/**
	 * Get pair overview
	 */
	async overview(
		params: PairOverviewParams,
		apiParams?: StandardApiParams,
	): PromisedApiResult<PairOverviewResponse> {
		const result = await this.api.fetch<{ data: PairOverviewResponseRaw }>(
			`${this.#base}/overview/multiple`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(stringsOrNumbersToDates(result.val.data, ['created_at']))
	}

	/**
	 * Get pair overview multiple
	 */
	async overviewMultiple(
		params: PairOverviewMultipleParams,
		apiParams?: StandardApiParams,
	): PromisedApiResult<PairOverviewMultipleResponse> {
		const result = await this.api.fetch<{
			data: PairOverviewMultipleResponseRaw
		}>(`${this.#base}/overview/multiple`, {
			...apiParams,
			queryParams: params,
		})

		if (result.err) {
			return result
		}

		return new Ok(
			Object.fromEntries(
				Object.entries(result.val.data).map(([key, value]) => [
					key,
					stringsOrNumbersToDates(value, ['created_at']),
				]),
			),
		)
	}
}

export const createPair = (
	...params: ConstructorParameters<typeof PairFetcher>
) => wrapWithThrow(new PairFetcher(...params))

import type {
	Api,
	PromisedApiResult,
	StandardApiParams,
	StandardApiParamsWithAllChains,
} from './api'
import type { Chain } from './constants'
import { datesToNumbers } from './utils/converters'
import { Ok } from './utils/result'
import type { ListResponse, SortType, TransactionType } from './utils/types'
import { wrapWithThrow } from './utils/wrap-utils'

export type Trader = ReturnType<typeof createTrader>

export type TraderGainersLosersParams = {
	/**
	 * @default '1W'
	 */
	type?: '1W' | 'today' | 'yesterday'
	/**
	 * @default 'PnL'
	 */
	sort_by?: 'PnL'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	offset?: number
	limit?: number
}

export type TraderGainersLosersResponse = ListResponse<{
	network: Chain
	address: string
	pnl: number
	trade_count: number
	volume: number
}>

type TraderTradesByTimeParams = {
	address: string
	/**
	 * @default 'swap'
	 */
	tx_type?: TransactionType
	offset?: number
	/**
	 * @default 100
	 */
	limit?: number
	before_time?: number | Date
	after_time?: number | Date
}

type TradeSide = {
	symbol: string
	decimals: number
	address: string
	amount: number
	type: TransactionType
	type_swap: string
	fee_info?: string | null
	ui_amount: number
	price: number | null
	nearest_price: number
	change_amount: number
	ui_change_amount: number
}

type TraderTradesByTimeItem = {
	quote: TradeSide
	base: TradeSide
	base_price: number | null
	quote_price: number
	tx_hash: string
	source: string
	block_unix_time: number
	tx_type: TransactionType
	address: string
	owner: string
}

type TraderTradesByTimeResponse = ListResponse<TraderTradesByTimeItem> & {
	has_next: boolean
}

class TraderFetcher {
	#base = '/trader'
	private readonly api: Api
	constructor(api: Api) {
		this.api = api
	}

	/**
	 * Get gainers and losers
	 */
	async gainersLosers(
		params: TraderGainersLosersParams,
		apiParams?: StandardApiParamsWithAllChains,
	): PromisedApiResult<TraderGainersLosersResponse> {
		const queryParams: TraderGainersLosersParams = {
			type: '1W',
			sort_by: 'PnL',
			sort_type: 'desc',
			...params,
		}

		const result = await this.api.fetch<{
			data: TraderGainersLosersResponse
		}>(`${this.#base}/gainers-losers`, {
			...apiParams,
			queryParams,
		})

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get trades by time
	 */
	async tradesByTime(
		params: TraderTradesByTimeParams,
		apiParams?: StandardApiParams,
	) {
		const result = await this.api.fetch<{ data: TraderTradesByTimeResponse }>(
			`${this.#base}/txs/seek_by_time`,
			{
				...apiParams,
				queryParams: datesToNumbers(params, ['before_time', 'after_time']),
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}
}

export const createTrader = (
	...params: ConstructorParameters<typeof TraderFetcher>
) => wrapWithThrow(new TraderFetcher(...params))

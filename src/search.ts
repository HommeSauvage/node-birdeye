import type { Api, StandardApiParams } from './api'
import type { Chain } from './constants'
import {
	type StringsToDates,
	stringsOrNumbersToDates,
} from './utils/converters'
import { Ok, type PromisedResult } from './utils/result'
import type { ListResponse, Market, SortType } from './utils/types'
import { wrapWithThrow } from './utils/wrap-utils'

export type Search = ReturnType<typeof createSearch>
type SearchSortBy =
	| 'fdv'
	| 'marketcap'
	| 'liquidity'
	| 'price'
	| 'price_change_24h_percent'
	| 'trade_24h'
	| 'trade_24h_change_percent'
	| 'buy_24h'
	| 'buy_24h_change_percent'
	| 'sell_24h'
	| 'sell_24h_change_percent'
	| 'unique_wallet_24h'
	| 'unique_view_24h_change_percent'
	| 'last_trade_unix_time'
	| 'volume_24h_usd'
	| 'volume_24h_change_percent'

type SearchParams = {
	keyword?: string
	/**
	 * @default 'all'
	 */
	target?: 'token' | 'market' | 'all'
	/**
	 * @default 'volume_24h_usd'
	 */
	sort_by?: SearchSortBy
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType

	/**
	 * A list of market sources to filter results
	 */
	markets?: Array<Market>
	offset?: number
	limit?: number
} & (
	| {
			chain: 'solana'
			/**
			 * A filter to retrieve tokens based on their verification status (supported on Solana)
			 */
			verify_token?: boolean
	  }
	| {
			/**
			 * @default 'all'
			 */
			chain?: Exclude<Chain, 'solana'> | 'all'
	  }
)

type FinalSearchParams = Omit<SearchParams, 'markets'> & {
	chain: NonNullable<SearchParams['chain']>
	sort_by: NonNullable<SearchParams['sort_by']>
	sort_type: NonNullable<SearchParams['sort_type']>
	markets: string
}

type TokenResultRaw = {
	name: string
	symbol: string
	address: string
	decimals: number
	fdv: number
	market_cap: number
	liquidity: number
	volume_24h_change_percent: number
	price: number
	price_change_24h_percent: number
	network: Chain
	buy_24h: number
	buy_24h_change_percent: number
	sell_24h: number
	sell_24h_change_percent: number
	trade_24h: number
	trade_24h_change_percent: number | null
	unique_wallet_24h: number
	unique_view_24h_change_percent: number | null
	last_trade_human_time: string
	last_trade_unix_time: number
	creation_time: string
	volume_24h_usd: number
	logo_uri?: string | null
	verified: boolean
}

type MarketResultRaw = {
	name: string
	address: string
	liquidity: number
	network: Chain
	trade_24h: number
	trade_24h_change_percent: number
	unique_wallet_24h: number
	unique_wallet_24h_change_percent: number
	base_mint: string
	quote_mint: string
	amount_base: number
	amout_quote: number
	creation_time: string
	volume_24h_usd: number
}

type TokenResult = StringsToDates<
	TokenResultRaw,
	'last_trade_human_time' | 'creation_time'
>
type MarketResult = StringsToDates<MarketResultRaw, 'creation_time'>

type SearchResponseRaw = ListResponse<
	| {
			type: 'token'
			result: Array<TokenResultRaw>
	  }
	| {
			type: 'market'
			result: Array<MarketResultRaw>
	  }
>

type SearchResponse = ListResponse<
	| {
			type: 'token'
			result: Array<TokenResult>
	  }
	| {
			type: 'market'
			result: Array<MarketResult>
	  }
>

class SearchFetcher {
	#base = '/defi/v3/search'
	readonly api: Api

	constructor(api: Api) {
		this.api = api
	}

	/**
	 * Search for token and market data by matching a pattern
	 * or a specific token, market address.
	 */
	async search(
		params: SearchParams,
		apiParams?: Omit<StandardApiParams, 'chain'>,
	): PromisedResult<SearchResponse> {
		const queryParams: FinalSearchParams = {
			chain: 'all',
			target: 'all',
			sort_type: 'desc',
			sort_by: 'volume_24h_usd',
			...params,
			// Overrise to transform to a comma separated string
			markets: (params.markets ?? []).join(', '),
		}

		const result = await this.api.fetch<{ data: SearchResponseRaw }>(
			`${this.#base}/search`,
			{
				...apiParams,
				queryParams,
				// The search api expects the chain to be a query param and not a header
				chain: null,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok({
			items: result.val.data.items.map((item) => {
				if (item.type === 'token') {
					const result = item.result.map((token) =>
						stringsOrNumbersToDates(token, [
							'last_trade_human_time',
							'creation_time',
						]),
					)
					return { ...item, result }
				}
				return {
					...item,
					result: item.result.map((market) =>
						stringsOrNumbersToDates(market, ['creation_time']),
					),
				}
			}),
		} as SearchResponse)
	}
}

export const createSearch = (
	...params: ConstructorParameters<typeof SearchFetcher>
) => wrapWithThrow(new SearchFetcher(...params))

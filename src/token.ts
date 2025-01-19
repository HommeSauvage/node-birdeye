import type { Api, StandardApiParams } from './api'
import type { Chain } from './constants'
import {
	type HoldersParams,
	type HoldersResponse,
	type MarketDataParams,
	type MarketDataResponse,
	type MarketsParams,
	type MarketsResponse,
	type MarketsResponseRaw,
	type MintBurnParams,
	type MintBurnResponse,
	type MintBurnResponseRaw,
	type NewListingsParams,
	type NewListingsResponse,
	type NewListingsResponseRaw,
	SECURITY_BOOL_KEYS,
	SECURITY_NUMBER_KEYS,
	type TokenCreationInfoParams,
	type TokenCreationInfoResponse,
	type TokenCreationInfoResponseRaw,
	type TokenListParams,
	type TokenListResponse,
	type TokenMetadataMultipleParams,
	type TokenMetadataMultipleResponse,
	type TokenMetadataParams,
	type TokenMetadataResponse,
	type TokenOverviewParams,
	type TokenOverviewResponse,
	type TokenOverviewResponseRaw,
	type TokenSecurityParams,
	type TokenSecurityResponse,
	type TokenSecurityResponseEvmRaw,
	type TokenSecurityResponseRaw,
	type TopTradersParams,
	type TopTradersResponse,
	type TradeDataMultipleParams,
	type TradeDataMultipleResponse,
	type TradeDataParams,
	type TradeDataResponse,
	type TrendingListParams,
	type TrendingListResponse,
} from './token.types'
import {
	datesToNumbers,
	stringsOrNumbersToBooleans,
	stringsOrNumbersToDates,
	stringsToNumbers,
} from './utils/converters'
import { Ok, type PromisedResult } from './utils/result'
import { wrapWithThrow } from './utils/wrap-utils'

export type Token = ReturnType<typeof createToken>

const LP_HOLDER_NUMBER_KEYS = ['balance', 'percent'] as const
const LP_HOLDER_BOOLEAN_KEYS = ['is_contract', 'is_locked'] as const
const LP_LOCK_DETAILS_DATE_KEYS = ['end_time', 'opt_time'] as const
const LP_LOCK_DETAILS_NUMBER_KEYS = ['amount'] as const

export class TokenFetcher {
	#base = '/defi'
	private readonly api: Api
	constructor(api: Api) {
		this.api = api
	}

	/**
	 * Get token list of any supported chains.
	 */
	async list(
		params: TokenListParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenListResponse> {
		const result = await this.api.fetch<{ data: TokenListResponse }>(
			`${this.#base}/tokenlist`,
			{
				...apiParams,
				queryParams: {
					sort_by: 'v24hUSD',
					sort_type: 'desc',
					...params,
				},
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get token security of any supported chains.
	 */
	async security<ApiParams extends StandardApiParams>(
		params: TokenSecurityParams,
		apiParams?: ApiParams,
	): PromisedResult<TokenSecurityResponse<ApiParams['chain']>> {
		const result = await this.api.fetch<{
			data: TokenSecurityResponseRaw<ApiParams['chain']>
		}>(`${this.#base}/token_security`, {
			...apiParams,
			queryParams: params,
		})

		if (result.err) {
			return result
		}

		const isSolana =
			apiParams?.chain === 'solana' || this.api.getDefaultChain() === 'solana'

		return new Ok(
			(isSolana
				? result.val.data
				: {
						...stringsOrNumbersToBooleans(
							stringsToNumbers(
								result.val.data as TokenSecurityResponseEvmRaw,
								SECURITY_NUMBER_KEYS,
							),
							SECURITY_BOOL_KEYS,
						),
						lpHolders: (
							result.val.data as TokenSecurityResponseEvmRaw
						).lpHolders.map((h) => {
							return {
								...stringsToNumbers(
									stringsOrNumbersToBooleans(h, LP_HOLDER_BOOLEAN_KEYS),
									LP_HOLDER_NUMBER_KEYS,
								),
								locked_detail: h.locked_detail?.map((d) =>
									stringsToNumbers(
										stringsOrNumbersToDates(d, LP_LOCK_DETAILS_DATE_KEYS),
										LP_LOCK_DETAILS_NUMBER_KEYS,
									),
								),
							}
						}),
					}) as unknown as TokenSecurityResponse<ApiParams['chain']>,
		)
	}

	/**
	 * Get overview of a token..
	 */
	async overview(
		params: TokenOverviewParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenOverviewResponse> {
		const result = await this.api.fetch<{ data: TokenOverviewResponseRaw }>(
			`${this.#base}/token_overview`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(
			stringsOrNumbersToDates(result.val.data, [
				'lastTradeHumanTime',
				'lastTradeUnixTime',
			]),
		)
	}

	async creationTokenInfo(
		params: TokenCreationInfoParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenCreationInfoResponse> {
		const result = await this.api.fetch<{ data: TokenCreationInfoResponseRaw }>(
			`${this.#base}/token_creation_info`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(stringsOrNumbersToDates(result.val.data, ['blockHumanTime']))
	}

	/**
	 * Retrieve a dynamic and up-to-date list of trending tokens based on
	 * specified sorting criteria.
	 */
	async trendingList(
		params: TrendingListParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TrendingListResponse> {
		const result = await this.api.fetch<{ data: TrendingListResponse }>(
			`${this.#base}/trending_list`,
			{
				...apiParams,
				queryParams: {
					sort_by: 'rank',
					sort_type: 'desc',
					...params,
				},
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * This endpoint facilitates the retrieval of a list of tokens on a specified
	 * blockchain network. This upgraded version is exclusive to business and enterprise
	 * packages. By simply including the header for the requested blockchain
	 * without any query parameters, business and enterprise users can
	 * get the full list of tokens on the specified blockchain in the URL
	 * returned in the response. This removes the need for the limit response
	 * of the previous version and reduces the workload of making multiple calls.
	 */
	async listV2(apiParams?: StandardApiParams): PromisedResult<any> {
		const result = await this.api.fetch<{ data: AnalyserOptions }>(
			`${this.#base}/v2/tokens/all`,
			apiParams,
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get newly listed tokens of any supported chains
	 */
	async newListings<C extends Chain | null | undefined>(
		params: NewListingsParams<C>,
		apiParams?: StandardApiParams,
	): PromisedResult<NewListingsResponse> {
		const result = await this.api.fetch<{ data: NewListingsResponseRaw }>(
			`${this.#base}/v2/tokens/new_listing`,
			{
				...apiParams,
				queryParams: datesToNumbers(
					{
						meme_platform_enabled: false,
						...params,
					},
					['time_to'],
				),
			},
		)

		if (result.err) {
			return result
		}

		return new Ok({
			...result.val.data,
			items: result.val.data.items.map((i) =>
				stringsOrNumbersToDates(i, ['liquidityAddedAt']),
			),
		})
	}

	/**
	 * Get top traders of given token
	 */
	async topTraders(
		params: TopTradersParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TopTradersResponse> {
		const result = await this.api.fetch<{ data: TopTradersResponse }>(
			`${this.#base}/v2/tokens/top_traders`,
			{
				...apiParams,
				queryParams: {
					time_frame: '24h',
					sort_type: 'desc',
					sort_by: 'volume',
					limit: 10,
					...params,
				} as TopTradersParams,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * The API provides detailed information about the markets for a specific
	 * cryptocurrency token on a specified blockchain. Users can retrieve data
	 * for one or multiple markets related to a single token. This endpoint
	 * requires the specification of a token address and the blockchain
	 * to filter results. Additionally, it supports optional query
	 * parameters such as offset, limit, and required sorting by liquidity
	 * or sort type (ascending or descending) to refine the output.
	 */
	async markets(
		params: MarketsParams,
		apiParams?: StandardApiParams,
	): PromisedResult<MarketsResponse> {
		const result = await this.api.fetch<{ data: MarketsResponseRaw }>(
			`${this.#base}/v2/markets`,
			{
				...apiParams,
				queryParams: {
					time_frame: '24h',
					sort_type: 'desc',
					sort_by: 'liquidity',
					limit: 10,
					...params,
				} as MarketsParams,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok({
			...result.val.data,
			items: result.val.data.items.map((i) =>
				stringsOrNumbersToDates(i, ['createdAt']),
			),
		})
	}

	/**
	 * Get metadata of a single token
	 */
	async metadata(
		params: TokenMetadataParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenMetadataResponse> {
		const result = await this.api.fetch<{ data: TokenMetadataResponse }>(
			`${this.#base}/v3/token/meta-data/single`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get metadata of multiple tokens
	 */
	async metadataMultiple(
		params: TokenMetadataMultipleParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenMetadataMultipleResponse> {
		const result = await this.api.fetch<{
			data: TokenMetadataMultipleResponse
		}>(`${this.#base}/v3/token/meta-data/multiple`, {
			...apiParams,
			queryParams: params,
		})

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get market data of single token
	 */
	async marketData(
		params: MarketDataParams,
		apiParams?: StandardApiParams,
	): PromisedResult<MarketDataResponse> {
		const result = await this.api.fetch<{ data: MarketDataResponse }>(
			`${this.#base}/v3/token/market-data`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get trade data of single token
	 */
	async tradeData(
		params: TradeDataParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TradeDataResponse> {
		const result = await this.api.fetch<{ data: TradeDataResponse }>(
			`${this.#base}/v3/token/trade-data/single`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get trade data of multiple tokens
	 */
	async tradeDataMultiple(
		params: TradeDataMultipleParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TradeDataMultipleResponse> {
		const result = await this.api.fetch<{ data: TradeDataMultipleResponse }>(
			`${this.#base}/v3/token/trade-data/multiple`,
			{
				...apiParams,
				queryParams: params,
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get top holder list of the given token
	 */
	async holders(
		params: HoldersParams,
		apiParams?: StandardApiParams,
	): PromisedResult<HoldersResponse> {
		const result = await this.api.fetch<{ data: HoldersResponse }>(
			`${this.#base}/v3/token/holders`,
			{
				...apiParams,
				queryParams: {
					limit: 100,
					...params,
				},
			},
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get mint/burn transaction list of the given token. Only support solana currently
	 */
	async mintBurn(
		params: MintBurnParams,
		apiParams?: Omit<StandardApiParams, 'chain'> & {
			chain: 'solana'
		},
	): PromisedResult<MintBurnResponse> {
		const result = await this.api.fetch<{ data: MintBurnResponseRaw }>(
			`${this.#base}/v3/token/mint-burn-txs`,
			{
				...apiParams,
				queryParams: datesToNumbers(
					{
						sort_by: 'block_time',
						sort_type: 'desc',
						type: 'all',
						limit: 100,
						...params,
					},
					['after_time', 'before_time'],
				),
			},
		)

		if (result.err) {
			return result
		}

		return new Ok({
			...result.val.data,
			items: result.val.data.items.map((i) =>
				stringsOrNumbersToDates(i, ['block_human_time']),
			),
		})
	}
}

export const createToken = (
	...params: ConstructorParameters<typeof TokenFetcher>
) => wrapWithThrow(new TokenFetcher(...params))

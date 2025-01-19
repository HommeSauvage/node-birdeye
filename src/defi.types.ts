import type { TimePeriod } from './constants'
import type { StringsToDates } from './utils/converters'
import type { SortType, TransactionType } from './utils/types'

type DefiPriceParamsBase = {
	check_liquidity?: number
	include_liquidity?: boolean
}

export type AddressType = 'toke' | 'pair'

export type WithTimeParams = {
	time_from: number | Date
	time_to: number | Date
}

// # Defi - Pric
export type DefiPriceParams = DefiPriceParamsBase & {
	address: string
}

export type DefiPriceResponseRaw = {
	value: number
	updateUnixTime: number
	updateHumanTime: string
	liquidity?: number
}

/**
 * Null if there's no price data
 */
export type DefiPriceResponse = null | StringsToDates<
	DefiPriceResponseRaw,
	'updateHumanTime'
>

// # Defi - Price Multiple
export type DefiPriceMultipleParams = DefiPriceParamsBase & {
	list_address: string[]
}

export interface DefiPriceMultipleResponse {
	/**
	 * Each key is a token address
	 */
	[key: string]: DefiPriceResponse
}

// # Defi - Price Historical
export interface DefiPriceHistoricalParams extends WithTimeParams {
	address: string
	/**
	 * @default 'token'
	 */
	address_type?: AddressType
	/**
	 * @default '15m'
	 */
	type?: TimePeriod
}

interface DefiPriceHistoricalData {
	value: number
	unixTime: number
}

export interface DefiPriceHistoricalResponse {
	items: DefiPriceHistoricalData[]
}

// # Defi - Price Historical by Unix Timestamp
export interface DefiPriceHistoricalByUnixTimestampParams {
	address: string
	unixtime?: number | Date
}

interface DefiPriceHistoricalByUnixTimestampData {
	value: number
	updateUnixTime: number
	priceChange24h: number
}

export interface DefiPriceHistoricalByUnixTimestampResponse {
	items: DefiPriceHistoricalByUnixTimestampData[]
}

export type BySortTypeParams = {
	sort_type: SortType
}
export type ByTimeParams = {
	after_time?: number | Date
	before_time?: number | Date
	sort_type?: never
}

interface DefiBaseTradeParams {
	address: string
	/**
	 * @default 0
	 */
	offset?: number
	/**
	 * @default 50
	 */
	limit?: number

	tx_type?: TransactionType
}
// # Defi - Token
export type DefiTradesParams =
	| (DefiBaseTradeParams & BySortTypeParams)
	| (DefiBaseTradeParams & ByTimeParams)

interface TokenDetails {
	symbol: string
	decimals: number
	address: string
	amount: number
	feeInfo: string | null
	uiAmount: number
	price: number | null
	nearestPrice: number
	changeAmount: number
	uiChangeAmount: number
}

interface DefiTradesData {
	quote: TokenDetails
	base: TokenDetails
	basePrice: number | null
	quotePrice: number | null
	txHash: string
	source: string
	blockUnixTime: number
	txType: string
	owner: string
	side: 'sell' | 'buy'
	alias: string | null
	pricePair: number
	from: TokenDetails
	to: TokenDetails
	tokenPrice: number | null
	poolId: string
}

export interface DefiTradesResponse {
	items: DefiTradesData[]
	hasNext: boolean
}

// # Defi - OHLCV
export type DefiOHLCVParams = (WithTimeParams & {
	/**
	 * @default '15m'
	 */
	type?: TimePeriod
}) &
	(
		| {
				/**
				 * @default 'token'
				 */
				address_type?: 'token' | 'pair'
				address: string
		  }
		| {
				address_type: 'base_quote'
				base_address: string
				quote_address: string
				address?: never
		  }
	)

export interface DefiOHLCVData {
	o: number
	h: number
	l: number
	c: number
	v: number
	unixTime: number
	address: string
	type: TimePeriod
}

export interface DefiOHLCVByBaseQuoteData {
	o: number
	c: number
	h: number
	l: number
	vBase: number
	vQuote: number
	unixTime: number
}

export interface DefiOHLCVByBaseQuoteResponse {
	items: DefiOHLCVByBaseQuoteData[]
}

// # Defi - Price Volume
type HourlyTime = '1h' | '2h' | '4h' | '8h' | '24h'
type DefiPriceVolumeParamsBase = {
	/**
	 * @default '24h'
	 */
	type?: HourlyTime
}
export type DefiPriceVolumeParams = DefiPriceVolumeParamsBase & {
	address: string
}
export type DefiPriceVolumeMultiParams = DefiPriceVolumeParamsBase & {
	list_address: string[]
}

export interface DefiPriceVolumeResponse {
	price: number
	updateUnixTime: number
	updateHumanTime: string
	volumeUSD: number
	volumeChangePercent: number
	priceChangePercent: number
}

export interface DefiPriceMultiVolumeResponse {
	[adress: string]: DefiPriceVolumeResponse
}

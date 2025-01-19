import type { Chain } from './constants'
import type {
	StringsOrNumbersToBooleans,
	StringsToDates,
	StringsToNumbers,
} from './utils/converters'
import type { ListResponse, SortType } from './utils/types'

export type TokenListParams = {
	/**
	 * @default 'v24hUSD'
	 */
	sort_by?: 'mc' | 'v24hUSD' | 'v24hUSDChangePercent'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	offset?: number
	/**
	 * @default 50
	 */
	limit?: number
	/**
	 * @default 100
	 */
	min_liquidity?: number
}

export type TokenListResponse = {
	updateUnixTime: number
	updateTime: string
	total: number
	tokens: Array<{
		address: string
		decimals: number
		lastTradeUnixTime: number
		liquidity: number
		logoURI: string
		mc: number
		name: string
		symbol: string
		v24hChangePercent?: number
		v24hUSD?: number
	}>
}

export type TokenSecurityParams = {
	address: string
}

export type TokenSecurityResponseSolana = {
	creatorAddress: string
	creatorOwnerAddress: string | null
	ownerAddress: string | null
	ownerOfOwnerAddress: string | null
	creationTx: string
	creationTime: number
	creationSlot: number
	mintTx: string
	mintTime: number
	mintSlot: number
	creatorBalance: number
	ownerBalance: number | null
	ownerPercentage: number | null
	creatorPercentage: number
	metaplexUpdateAuthority: string
	metaplexOwnerUpdateAuthority: string
	metaplexUpdateAuthorityBalance: number | null
	metaplexUpdateAuthorityPercent: number | null
	mutableMetadata: boolean
	top10HolderBalance: number
	top10HolderPercent: number
	top10UserBalance: number
	top10UserPercent: number
	isTrueToken: boolean | null
	fakeToken: boolean | null
	totalSupply: number
	preMarketHolder: Array<string>
	lockInfo: null
	freezeable: null
	freezeAuthority: null
	transferFeeEnable: null
	transferFeeData: null
	isToken2022: boolean
	nonTransferable: null
	jupStrictList: boolean
}

export type LPLockDetails = {
	amount: string
	end_time: string
	opt_time: string
}

export type LPHolderRaw = {
	address: string
	tag: string
	value: null | string
	is_contract: number
	balance: string
	percent: string
	NFT_list: any // TODO: fix this
	is_locked: number
	locked_detail?: LPLockDetails[]
}

export type TokenSecurityResponseEvmRaw = {
	antiWhaleModifiable: string
	buyTax: string
	canTakeBackOwnership: string
	cannotBuy: string
	cannotSellAll: string
	creatorAddress: string
	creatorBalance: string
	creatorPercentage: string
	externalCall: string
	hiddenOwner: string
	holderCount: string
	honeypotWithSameCreator: string
	isAntiWhale: string
	isBlacklisted: string
	isHoneypot: string
	isInDex: string
	isMintable: string
	isOpenSource: string
	isProxy: string
	isWhitelisted: string
	lpHolderCount: string
	lpHolders: LPHolderRaw[]
	lpTotalSupply: string
	ownerAddress: string
	ownerBalance: string
	ownerChangeBalance: string
	ownerPercentage: string
	personalSlippageModifiable: string
	sellTax: string
	slippageModifiable: string
	tokenName: string
	tokenSymbol: string
	totalSupply: string
	tradingCooldown: string
	transferPausable: string
}

export type TokenSecurityResponseEvm = StringsToNumbers<
	StringsOrNumbersToBooleans<
		TokenSecurityResponseEvmRaw,
		(typeof SECURITY_BOOL_KEYS)[number]
	>,
	(typeof SECURITY_NUMBER_KEYS)[number]
>

export const SECURITY_NUMBER_KEYS = [
	'creatorBalance',
	'creatorPercentage',
	'holderCount',
	'honeypotWithSameCreator',
	'lpHolderCount',
	'lpTotalSupply',
	'ownerBalance',
	'ownerChangeBalance',
	'ownerPercentage',
	'personalSlippageModifiable',
	'sellTax',
	'tradingCooldown',
] as const satisfies ReadonlyArray<keyof TokenSecurityResponseEvmRaw>

export const SECURITY_BOOL_KEYS = [
	'isAntiWhale',
	'antiWhaleModifiable',
	'buyTax',
	'canTakeBackOwnership',
	'cannotBuy',
	'cannotSellAll',
	'externalCall',
	'hiddenOwner',
	'isAntiWhale',
	'isBlacklisted',
	'isHoneypot',
	'isInDex',
	'isMintable',
	'isOpenSource',
	'isProxy',
	'isWhitelisted',
	'slippageModifiable',
	'transferPausable',
] as const satisfies ReadonlyArray<keyof TokenSecurityResponseEvmRaw>

export type TokenSecurityResponse<T extends Chain | null | undefined> =
	T extends 'solana' | undefined
		? TokenSecurityResponseSolana
		: TokenSecurityResponseEvm

export type TokenSecurityResponseRaw<T extends Chain | null | undefined> =
	T extends 'solana' | undefined
		? TokenSecurityResponseSolana
		: TokenSecurityResponseEvmRaw

export type TokenOverviewParams = {
	address: string
}

export type TokenOverviewResponseRaw = {
	address: string
	decimals: number
	symbol: string
	name: string
	extensions: {
		coingeckoId: string | null
		serumV3Usdc: string | null
		serumV3Usdt: string | null
		website: string | null
		telegram: string | null
		twitter: string | null
		description: string | null
		discord: string | null
		medium: string | null
	}
	logoURI: string | null
	liquidity: number
	lastTradeUnixTime: number
	lastTradeHumanTime: string
	price: number | null
	history30mPrice: number | null
	priceChange30mPercent: number | null
	history1hPrice: number | null
	priceChange1hPercent: number | null
	history2hPrice: number | null
	priceChange2hPercent: number | null
	history4hPrice: number | null
	priceChange4hPercent: number | null
	history6hPrice: number | null
	priceChange6hPercent: number | null
	history8hPrice: number | null
	priceChange8hPercent: number | null
	history12hPrice: number | null
	priceChange12hPercent: number | null
	history24hPrice: number | null
	priceChange24hPercent: number | null
	uniqueWallet30m: number | null
	uniqueWalletHistory30m: number | null
	uniqueWallet30mChangePercent: number | null
	uniqueWallet1h: number | null
	uniqueWalletHistory1h: number | null
	uniqueWallet1hChangePercent: number | null
	uniqueWallet2h: number | null
	uniqueWalletHistory2h: number | null
	uniqueWallet2hChangePercent: number | null
	uniqueWallet4h: number | null
	uniqueWalletHistory4h: number | null
	uniqueWallet4hChangePercent: number | null
	uniqueWallet8h: number | null
	uniqueWalletHistory8h: number | null
	uniqueWallet8hChangePercent: number | null
	uniqueWallet24h: number | null
	uniqueWalletHistory24h: number | null
	uniqueWallet24hChangePercent: number | null
	supply: number
	mc: number
	circulatingSupply: number
	realMc: number
	holder: number
	trade30m: number | null
	tradeHistory30m: number | null
	trade30mChangePercent: number | null
	sell30m: number | null
	sellHistory30m: number | null
	sell30mChangePercent: number | null
	buy30m: number | null
	buyHistory30m: number | null
	buy30mChangePercent: number | null
	v30m: number | null
	v30mUSD: number | null
	vHistory30m: number | null
	vHistory30mUSD: number | null
	v30mChangePercent: number | null
	vBuy30m: number | null
	vBuy30mUSD: number | null
	vBuyHistory30m: number | null
	vBuyHistory30mUSD: number | null
	vBuy30mChangePercent: number | null
	vSell30m: number | null
	vSell30mUSD: number | null
	vSellHistory30m: number | null
	vSellHistory30mUSD: number | null
	vSell30mChangePercent: number | null
	trade1h: number | null
	tradeHistory1h: number | null
	trade1hChangePercent: number | null
	sell1h: number | null
	sellHistory1h: number | null
	sell1hChangePercent: number | null
	buy1h: number | null
	buyHistory1h: number | null
	buy1hChangePercent: number | null
	v1h: number | null
	v1hUSD: number | null
	vHistory1h: number | null
	vHistory1hUSD: number | null
	v1hChangePercent: number | null
	vBuy1h: number | null
	vBuy1hUSD: number | null
	vBuyHistory1h: number | null
	vBuyHistory1hUSD: number | null
	vBuy1hChangePercent: number | null
	vSell1h: number | null
	vSell1hUSD: number | null
	vSellHistory1h: number | null
	vSellHistory1hUSD: number | null
	vSell1hChangePercent: number | null
	trade2h: number | null
	tradeHistory2h: number | null
	trade2hChangePercent: number | null
	sell2h: number | null
	sellHistory2h: number | null
	sell2hChangePercent: number | null
	buy2h: number | null
	buyHistory2h: number | null
	buy2hChangePercent: number | null
	v2h: number | null
	v2hUSD: number | null
	vHistory2h: number | null
	vHistory2hUSD: number | null
	v2hChangePercent: number | null
	vBuy2h: number | null
	vBuy2hUSD: number | null
	vBuyHistory2h: number | null
	vBuyHistory2hUSD: number | null
	vBuy2hChangePercent: number | null
	vSell2h: number | null
	vSell2hUSD: number | null
	vSellHistory2h: number | null
	vSellHistory2hUSD: number | null
	vSell2hChangePercent: number | null
	trade4h: number | null
	tradeHistory4h: number | null
	trade4hChangePercent: number | null
	sell4h: number | null
	sellHistory4h: number | null
	sell4hChangePercent: number | null
	buy4h: number | null
	buyHistory4h: number | null
	buy4hChangePercent: number | null
	v4h: number | null
	v4hUSD: number | null
	vHistory4h: number | null
	vHistory4hUSD: number | null
	v4hChangePercent: number | null
	vBuy4h: number | null
	vBuy4hUSD: number | null
	vBuyHistory4h: number | null
	vBuyHistory4hUSD: number | null
	vBuy4hChangePercent: number | null
	vSell4h: number | null
	vSell4hUSD: number | null
	vSellHistory4h: number | null
	vSellHistory4hUSD: number | null
	vSell4hChangePercent: number | null
	trade8h: number | null
	tradeHistory8h: number | null
	trade8hChangePercent: number | null
	sell8h: number | null
	sellHistory8h: number | null
	sell8hChangePercent: number | null
	buy8h: number | null
	buyHistory8h: number | null
	buy8hChangePercent: number | null
	v8h: number | null
	v8hUSD: number | null
	vHistory8h: number | null
	vHistory8hUSD: number | null
	v8hChangePercent: number | null
	vBuy8h: number | null
	vBuy8hUSD: number | null
	vBuyHistory8h: number | null
	vBuyHistory8hUSD: number | null
	vBuy8hChangePercent: number | null
	vSell8h: number | null
	vSell8hUSD: number | null
	vSellHistory8h: number | null
	vSellHistory8hUSD: number | null
	vSell8hChangePercent: number | null
	trade24h: number | null
	tradeHistory24h: number | null
	trade24hChangePercent: number | null
	sell24h: number | null
	sellHistory24h: number | null
	sell24hChangePercent: number | null
	buy24h: number | null
	buyHistory24h: number | null
	buy24hChangePercent: number | null
	v24h: number | null
	v24hUSD: number | null
	vHistory24h: number | null
	vHistory24hUSD: number | null
	v24hChangePercent: number | null
	vBuy24h: number | null
	vBuy24hUSD: number | null
	vBuyHistory24h: number | null
	vBuyHistory24hUSD: number | null
	vBuy24hChangePercent: number | null
	vSell24h: number | null
	vSell24hUSD: number | null
	vSellHistory24h: number | null
	vSellHistory24hUSD: number | null
	vSell24hChangePercent: number | null
	watch: unknown
	numberMarkets: number
}

export type TokenOverviewResponse = StringsToDates<
	TokenOverviewResponseRaw,
	'lastTradeHumanTime' | 'lastTradeUnixTime'
>

export type TokenCreationInfoParams = {
	txHash: string
	slot: number
	tokenAddress: string
	decimals: number
	owner: string
	blockUnixTime: number
	blockHumanTime: string
}

export type TokenCreationInfoResponseRaw = {
	txHash: string
	slot: number
	tokenAddress: string
	decimals: number
	owner: string
	blockUnixTime: number
	blockHumanTime: string
}

export type TokenCreationInfoResponse = StringsToDates<
	TokenCreationInfoResponseRaw,
	'blockHumanTime'
>

export type TrendingListParams = {
	/**
	 * @default 'rank'
	 */
	sort_by?: 'rank' | 'volume24hUSD' | 'liquidity'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	offset?: number
	limit?: number
}

export type TrendingListResponse = {
	updateUnixTime: number
	updateTime: string
	total: number
	tokens: Array<{
		address: string
		decimals: number
		liquidity: number
		logoURI?: string
		name: string
		symbol: string
		volume24hUSD: number
		rank: number
		price: number | null
	}>
}

export type NewListingsParams<C extends Chain | null | undefined> = {
	time_to: number | Date
	/**
	 * @default 10
	 * @max 20
	 */
	limit?: number
} & (C extends 'solana'
	? {
			/**
			 * enable to receive token new listing from meme platforms (eg: pump.fun). This filter only supports Solana
			 * @default false
			 */
			meme_platform_enabled?: boolean
		}
	: { [k: string]: never })

export type NewListingsResponseRaw = ListResponse<{
	address: string
	symbol: string
	name: string
	decimals: number
	source: string
	liquidityAddedAt: string
	logoURI: string | null
	liquidity: number
}>
export type NewListingsResponse = ListResponse<
	StringsToDates<NewListingsResponseRaw['items'][number], 'liquidityAddedAt'>
>

export type TopTradersParams = {
	address: string
	/**
	 * @default '24h'
	 */
	time_frame?: '30m' | '1h' | '2h' | '4h' | '8h' | '12h' | '24h'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	/**
	 * @default 'volume'
	 */
	sort_by?: 'volume' | 'trade'
	offset?: number
	/**
	 * @default 10
	 */
	limit?: number
}

export type TopTradersResponse = {
	tokenAddress: string
	owner: string
	tags: string[]
	type: string
	volume: number
	trade: number
	tradeBuy: number
	tradeSell: number
	volumeBuy: number
	volumeSell: number
}

export type MarketsParams = {
	address: string
	/**
	 * @default '24h'
	 */
	time_frame?: '30m' | '1h' | '2h' | '4h' | '8h' | '12h' | '24h'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	/**
	 * @default 'liquidity'
	 */
	sort_by?: 'liquidity' | 'volume24h'
	offset?: number
	/**
	 * @default 10
	 */
	limit?: number
}

export type MarketsResponseRaw = ListResponse<{
	address: string
	base: {
		address: string
		decimals: number
		symbol: string
		icon?: string
	}
	createdAt: string
	liquidity: number
	name: string
	price: number | null
	quote: {
		address: string
		decimals: number
		icon?: string
		symbol: string
	}
	source: string
	trade24h: number
	trade24hChangePercent: number
	uniqueWallet24h?: number
	uniqueWallet24hChangePercent?: number
	volume24h: number
}> & {
	total: number
}

export type MarketsResponse = ListResponse<
	StringsToDates<MarketsResponseRaw['items'][number], 'createdAt'>
>

export type TokenMetadataParams = {
	address: string
}

export type TokenMetadataResponse = {
	address: string
	symbol: string
	name: string
	decimals: number
	extensions: {
		coingecko_id: string | null
		website: string | null
		twitter: string | null
		discord: string | null
		medium: string | null
	}
	logo_uri: string
}

export type TokenMetadataMultipleParams = {
	list_address: string[]
}

export type TokenMetadataMultipleResponse = {
	[k: string]: TokenMetadataResponse
}

export type MarketDataParams = {
	address: string
}

export type MarketDataResponse = {
	address: string
	liquidity: number
	price: number
	supply: number
	marketcap: number
	circulating_supply: number
	circulating_marketcap: number
}

export type TradeDataParams = {
	address: string
}

export type TradeDataResponse = {
	address: string
	holder: number
	market: number
	last_trade_unix_time: number
	last_trade_human_time: string
	price: number | null
	history_30m_price: number | null
	price_change_30m_percent: number | null
	history_1h_price: number | null
	price_change_1h_percent: number | null
	history_2h_price: number | null
	price_change_2h_percent: number | null
	history_4h_price: number | null
	price_change_4h_percent: number | null
	history_6h_price: number | null
	price_change_6h_percent: number | null
	history_8h_price: number | null
	price_change_8h_percent: number | null
	history_12h_price: number | null
	price_change_12h_percent: number | null
	history_24h_price: number | null
	price_change_24h_percent: number | null
	unique_wallet_30m: number | null
	unique_wallet_history_30m: number | null
	unique_wallet_30m_change_percent: number | null
	unique_wallet_1h: number | null
	unique_wallet_history_1h: number | null
	unique_wallet_1h_change_percent: number | null
	unique_wallet_2h: number | null
	unique_wallet_history_2h: number | null
	unique_wallet_2h_change_percent: number | null
	unique_wallet_4h: number | null
	unique_wallet_history_4h: number | null
	unique_wallet_4h_change_percent: number | null
	unique_wallet_8h: number | null
	unique_wallet_history_8h: number | null
	unique_wallet_8h_change_percent: number | null
	unique_wallet_24h: number | null
	unique_wallet_history_24h: number | null
	unique_wallet_24h_change_percent: number | null
	trade_30m: number | null
	trade_history_30m: number | null
	trade_30m_change_percent: number | null
	sell_30m: number | null
	sell_history_30m: number | null
	sell_30m_change_percent: number | null
	buy_30m: number | null
	buy_history_30m: number | null
	buy_30m_change_percent: number | null
	volume_30m: number | null
	volume_30m_usd: number | null
	volume_history_30m: number | null
	volume_history_30m_usd: number | null
	volume_30m_change_percent: number | null
	volume_buy_30m: number | null
	volume_buy_30m_usd: number | null
	volume_buy_history_30m: number | null
	volume_buy_history_30m_usd: number | null
	volume_buy_30m_change_percent: number | null
	volume_sell_30m: number | null
	volume_sell_30m_usd: number | null
	volume_sell_history_30m: number | null
	volume_sell_history_30m_usd: number | null
	volume_sell_30m_change_percent: number | null
	trade_1h: number | null
	trade_history_1h: number | null
	trade_1h_change_percent: number | null
	sell_1h: number | null
	sell_history_1h: number | null
	sell_1h_change_percent: number | null
	buy_1h: number | null
	buy_history_1h: number | null
	buy_1h_change_percent: number | null
	volume_1h: number | null
	volume_1h_usd: number | null
	volume_history_1h: number | null
	volume_history_1h_usd: number | null
	volume_1h_change_percent: number | null
	volume_buy_1h: number | null
	volume_buy_1h_usd: number | null
	volume_buy_history_1h: number | null
	volume_buy_history_1h_usd: number | null
	volume_buy_1h_change_percent: number | null
	volume_sell_1h: number | null
	volume_sell_1h_usd: number | null
	volume_sell_history_1h: number | null
	volume_sell_history_1h_usd: number | null
	volume_sell_1h_change_percent: number | null
	trade_2h: number | null
	trade_history_2h: number | null
	trade_2h_change_percent: number | null
	sell_2h: number | null
	sell_history_2h: number | null
	sell_2h_change_percent: number | null
	buy_2h: number | null
	buy_history_2h: number | null
	buy_2h_change_percent: number | null
	volume_2h: number | null
	volume_2h_usd: number | null
	volume_history_2h: number | null
	volume_history_2h_usd: number | null
	volume_2h_change_percent: number | null
	volume_buy_2h: number | null
	volume_buy_2h_usd: number | null
	volume_buy_history_2h: number | null
	volume_buy_history_2h_usd: number | null
	volume_buy_2h_change_percent: number | null
	volume_sell_2h: number | null
	volume_sell_2h_usd: number | null
	volume_sell_history_2h: number | null
	volume_sell_history_2h_usd: number | null
	volume_sell_2h_change_percent: number | null
	trade_4h: number | null
	trade_history_4h: number | null
	trade_4h_change_percent: number | null
	sell_4h: number | null
	sell_history_4h: number | null
	sell_4h_change_percent: number | null
	buy_4h: number | null
	buy_history_4h: number | null
	buy_4h_change_percent: number | null
	volume_4h: number | null
	volume_4h_usd: number | null
	volume_history_4h: number | null
	volume_history_4h_usd: number | null
	volume_4h_change_percent: number | null
	volume_buy_4h: number | null
	volume_buy_4h_usd: number | null
	volume_buy_history_4h: number | null
	volume_buy_history_4h_usd: number | null
	volume_buy_4h_change_percent: number | null
	volume_sell_4h: number | null
	volume_sell_4h_usd: number | null
	volume_sell_history_4h: number | null
	volume_sell_history_4h_usd: number | null
	volume_sell_4h_change_percent: number | null
	trade_8h: number | null
	trade_history_8h: number | null
	trade_8h_change_percent: number | null
	sell_8h: number | null
	sell_history_8h: number | null
	sell_8h_change_percent: number | null
	buy_8h: number | null
	buy_history_8h: number | null
	buy_8h_change_percent: number | null
	volume_8h: number | null
	volume_8h_usd: number | null
	volume_history_8h: number | null
	volume_history_8h_usd: number | null
	volume_8h_change_percent: number | null
	volume_buy_8h: number | null
	volume_buy_8h_usd: number | null
	volume_buy_history_8h: number | null
	volume_buy_history_8h_usd: number | null
	volume_buy_8h_change_percent: number | null
	volume_sell_8h: number | null
	volume_sell_8h_usd: number | null
	volume_sell_history_8h: number | null
	volume_sell_history_8h_usd: number | null
	volume_sell_8h_change_percent: number | null
	trade_24h: number | null
	trade_history_24h: number | null
	trade_24h_change_percent: number | null
	sell_24h: number | null
	sell_history_24h: number | null
	sell_24h_change_percent: number | null
	buy_24h: number | null
	buy_history_24h: number | null
	buy_24h_change_percent: number | null
	volume_24h: number | null
	volume_24h_usd: number | null
	volume_history_24h: number | null
	volume_history_24h_usd: number | null
	volume_24h_change_percent: number | null
	volume_buy_24h: number | null
	volume_buy_24h_usd: number | null
	volume_buy_history_24h: number | null
	volume_buy_history_24h_usd: number | null
	volume_buy_24h_change_percent: number | null
	volume_sell_24h: number | null
	volume_sell_24h_usd: number | null
	volume_sell_history_24h: number | null
	volume_sell_history_24h_usd: number | null
	volume_sell_24h_change_percent: number | null
}

export type TradeDataMultipleParams = {
	list_address: string[]
}

export type TradeDataMultipleResponse = {
	[k: string]: TradeDataResponse
}

export type HoldersParams = {
	address: string
	offset?: number
	/**
	 * @default 100
	 */
	limit?: number
}

export type HoldersResponse = ListResponse<{
	amount: string
	decimals: number
	mint: string
	owner: string
	token_account: string
	ui_amount: number
}>

export type MintBurnParams = {
	address: string
	/**
	 * @default 'block_time'
	 */
	sort_by?: 'block_time' | 'tx_count'
	/**
	 * @default 'desc'
	 */
	sort_type?: SortType
	/**
	 * @default 'all'
	 */
	type?: 'all' | 'mint' | 'burn'
	after_time?: number | Date
	before_time?: number | Date
	offset?: number
	/**
	 * @default 100
	 */
	limit?: number
}

export type MintBurnResponseRaw = ListResponse<{
	amount: string
	block_human_time: string
	block_time: number
	common_type: 'burn' | 'mint'
	decimals: number
	mint: string
	program_id: string
	slot: number
	tx_hash: string
	ui_amount: number
	ui_amount_string: string
}>

export type MintBurnResponse = ListResponse<
	StringsToDates<MintBurnResponseRaw['items'][number], 'block_human_time'>
>

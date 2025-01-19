import type { Api, StandardApiParams } from './api'
import type { Chain } from './constants'
import {
	type StringsToDates,
	stringsOrNumbersToDates,
} from './utils/converters'
import { Ok, type PromisedResult } from './utils/result'
import type { ListResponse } from './utils/types'
import { wrapWithThrow } from './utils/wrap-utils'

export type Wallet = ReturnType<typeof createWallet>

export type WalletPortfolioParams = {
	wallet: string
}

export interface TokenHolding {
	address: string
	name?: string
	symbol?: string
	decimals: number
	balance: number
	uiAmount: number
	chainId: string
	logoURI?: string
	priceUsd?: number
	valueUsd?: number
}

export type WalletPortfolioResponse = {
	wallet: string
	totalUsd: number
} & ListResponse<TokenHolding>

export type WalletTokenBalanceParams = {
	wallet: string
	token_address: string
}

export type WalletTransactionHistoryParams<T extends Chain | undefined | null> =
	{
		wallet: string
		/**
		 * @default 100
		 */
		limit?: number
	} & (T extends 'solana' | undefined // udefined becuase the default chain is solana
		? {
				/**
				 * A transaction hash to traverse starting from. Only works with Solana
				 */
				before?: string
			}
		: { [k: string]: never })

type TokenBalanceChange = {
	amount: number
	symbol: string
	name: string
	decimals: number
	address: string
	logoURI: string
}

export type TransactionHistoryItemRaw<T extends Chain | undefined | null> = {
	txHash: string
	blockNumber: number
	blockTime: string
	status: boolean
	from: string
	to: string
	fee: number
	mainAction: string
	contractLabel?: {
		address: string
		name: string
		metadata: Record<string, unknown>
	}
	balanceChange?: TokenBalanceChange[]
} & (T extends 'ethereum'
	? {
			gasUsed?: number
			gasPrice?: number
			feeUsd?: number
			value: string
		}
	: { [k: string]: never })

type TransactionHistoryItem<T extends Chain | undefined | null> =
	StringsToDates<TransactionHistoryItemRaw<T>, 'blockTime'>

type WalletTransactionHistoryResponseRaw<T extends Chain | undefined | null> = {
	[chain: string]: TransactionHistoryItemRaw<T>[]
}

export type WalletTransactionHistoryResponse<
	T extends Chain | undefined | null,
> = TransactionHistoryItem<T>[]

export type SimulateTransactionParams = {
	from: string
	to: string
	value: string
	data: string
}

export type SimulateTransactionResponse = {
	gasUsed?: number
	balanceChange: Array<{
		index: number
		before: number
		after: number
		address: string
		name: string
		symbol: string
		logoURI?: string
		decimals: number
	}>
}

class WalletFetcher {
	#base = '/v1/wallet'
	private readonly api: Api
	constructor(api: Api) {
		this.api = api
	}

	/**
	 * List supported chains
	 */
	async listSupportedChain() {
		const result = await this.api.fetch<{ data: Array<string> }>(
			`${this.#base}/list_supported_chain`,
		)

		if (result.err) {
			return result
		}

		return new Ok(result.val.data)
	}

	/**
	 * Get portfolio of a wallet
	 */
	async portfolio(
		params: WalletPortfolioParams,
		apiParams?: StandardApiParams,
	): PromisedResult<WalletPortfolioResponse> {
		const result = await this.api.fetch<{ data: WalletPortfolioResponse }>(
			`${this.#base}/portfolio`,
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
	 * Get token balance of a wallet
	 */
	async tokenBalance(
		params: WalletTokenBalanceParams,
		apiParams?: StandardApiParams,
	): PromisedResult<TokenHolding> {
		const result = await this.api.fetch<{ data: TokenHolding }>(
			`${this.#base}/token_balance`,
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
	 * Get transaction history of a wallet
	 */
	async transactionHistory<ApiParams extends StandardApiParams>(
		params: WalletTransactionHistoryParams<ApiParams['chain']>,
		apiParams?: ApiParams,
	): PromisedResult<WalletTransactionHistoryResponse<ApiParams['chain']>> {
		const result = await this.api.fetch<{
			data: WalletTransactionHistoryResponseRaw<ApiParams['chain']>
		}>(`${this.#base}/tx_list`, {
			...apiParams,
			queryParams: {
				limit: 100,
				...params,
			},
		})

		if (result.err) {
			return result
		}

		return new Ok(
			result.val.data[apiParams?.chain ?? 'solana'].map((i) =>
				stringsOrNumbersToDates(i, ['blockTime']),
			) as WalletTransactionHistoryResponse<ApiParams['chain']>,
		)
	}

	/**
	 * Simulate a transaction
	 */
	async simulateTransaction(
		params: SimulateTransactionParams,
		apiParams?: StandardApiParams,
	) {
		const result = await this.api.fetch<{ data: SimulateTransactionResponse }>(
			`${this.#base}/simulate`,
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
}

export const createWallet = (
	...params: ConstructorParameters<typeof WalletFetcher>
) => wrapWithThrow(new WalletFetcher(...params))

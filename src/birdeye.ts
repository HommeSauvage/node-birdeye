import { Api } from './api'
import type { Chain } from './constants'
import { type Defi, createDefi } from './defi'
import { type Pair, createPair } from './pair'
import { type Search, createSearch } from './search'
import { type Token, createToken } from './token'
import { type Trader, createTrader } from './trader'
import { ErrorWithResult } from './utils/wrap-utils'
import { type Wallet, createWallet } from './wallet'

export class Birdeye {
	defi: Defi
	token: Token
	wallet: Wallet
	trader: Trader
	pair: Pair
	search: Search

	constructor(apiKey: string, defaultChain?: Chain, baseUrl?: string) {
		const api = new Api(apiKey, defaultChain, baseUrl)
		this.defi = createDefi(api)
		this.token = createToken(api)
		this.wallet = createWallet(api)
		this.trader = createTrader(api)
		this.pair = createPair(api)
		this.search = createSearch(api)
	}
}

export default function createBirdeye(
	...params: ConstructorParameters<typeof Birdeye>
): Birdeye {
	return new Birdeye(...params)
}

export function isBirdeyeError(e: any): e is ErrorWithResult {
	return e instanceof ErrorWithResult
}

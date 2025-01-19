export type SortType = 'asc' | 'desc'
export type Market =
	| 'Raydium'
	| 'Raydium CP'
	| 'Raydium Clamm'
	| 'Meteora'
	| 'Meteora DLMM'
	| 'Fluxbeam'
	| 'Pump.fun'
	| 'OpenBook'
	| 'OpenBook V2'
	| 'Orca'

export interface ListResponse<T> {
	items: T[]
}

export type TransactionType = 'swap' | 'add' | 'remove' | 'all'

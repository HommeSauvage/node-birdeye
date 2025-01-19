export type Chain = (typeof Chains)[keyof typeof Chains]
export type TimePeriod = (typeof TimePeriods)[keyof typeof TimePeriods]
export const Chains = {
	solana: 'solana',
	ethereum: 'ethereum',
	arbitrum: 'arbitrum',
	avalanche: 'avalanche',
	bsc: 'bsc',
	optimism: 'optimism',
	polygon: 'polygon',
	base: 'base',
	zksync: 'zksync',
	sui: 'sui',
} as const

export const TimePeriods = {
	'1m': '1m',
	'3m': '3m',
	'5m': '5m',
	'15m': '15m',
	'30m': '30m',
	'1H': '1H',
	'2H': '2H',
	'4H': '4H',
	'6H': '6H',
	'8H': '8H',
	'12H': '12H',
	'1D': '1D',
	'3D': '3D',
	'1W': '1W',
	'1M': '1M',
} as const

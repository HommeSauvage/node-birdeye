# node-birdeye

A powerful and intuitive TypeScript SDK for interacting with the Birdeye API. This SDK provides a clean interface to access Birdeye's comprehensive DeFi data and trading functionality.

## Installation

```bash
bun add node-birdeye
pnpm add node-birdeye
npm install node-birdeye
yarn add node-birdeye
```

## Quick Start

### ESM
```typescript
import { Birdeye } from 'node-birdeye'

// Initialize the client
const birdeye = new Birdeye('YOUR_API_KEY')

// Example: Get token overview
const tokenOverview = await birdeye.token.overview({
  address: 'TOKEN_ADDRESS'
})

// Using OrThrow for automatic error throwing
const tokenOverviewOrThrow = await birdeye.token.overviewOrThrow({
  address: 'TOKEN_ADDRESS'
})
```

### CommonJS
```javascript
const createBirdeye = require('node-birdeye').default

// Initialize the client
const birdeye = createBirdeye('YOUR_API_KEY')

// Example: Get token overview
const main = async () => {
  const tokenOverview = await birdeye.token.overview({
    address: 'TOKEN_ADDRESS'
  })

  // Using OrThrow for automatic error throwing
  const tokenOverviewOrThrow = await birdeye.token.overviewOrThrow({
    address: 'TOKEN_ADDRESS'
  })
}
```

## ⚠️ Alpha Status

> **Note**: This SDK is currently in alpha (v0.x.x). The API surface is subject to breaking changes until v1.0.0.
>
> Areas for improvement:
> - Test coverage
> - Documentation
> - Additional features
> - Even better types
>
> Pull requests are welcome! Feel free to contribute.

## Features

The SDK provides access to several key Birdeye API features:

- **Token Operations** (`birdeye.token`)
  - Token overview, metadata, and market data
  - Security analysis
  - Holder information
  - Trading data and statistics

- **DeFi Analytics** (`birdeye.defi`)
  - Protocol analytics
  - Yield farming data
  - Liquidity pool information

- **Trading** (`birdeye.trader`)
  - Execute trades
  - Get quotes
  - Trading history

- **Wallet Analysis** (`birdeye.wallet`)
  - Portfolio tracking
  - Transaction history
  - Holdings analysis

- **Pair Information** (`birdeye.pair`)
  - Trading pair data
  - Liquidity information
  - Price charts

- **Search Functionality** (`birdeye.search`)
  - Token search
  - Market discovery

You can refer to the [Birdeye API documentation](https://docs.birdeye.so/reference/authentication) for more information on each feature.

## Error Handling

The SDK provides two ways to handle errors:

1. **Result-based approach** (default)
```typescript
const result = await birdeye.token.overview({ address: 'TOKEN_ADDRESS' })
if (result.err) {
  // Handle error
  console.error(result.val)
} else {
  // Use the data
  console.log(result.val)
}
```

2. **Throw-based approach** (using OrThrow)
```typescript
try {
  const data = await birdeye.token.overviewOrThrow({ address: 'TOKEN_ADDRESS' })
  console.log(data)
} catch (error) {
  console.error(error)
}
```

## Chain Support

The SDK supports multiple chains. The default chain is Solana, however, you can specify a default chain during initialization or override it per request (when applicable):

```typescript
// Set default chain (the default is solana)
const birdeye = createBirdeye('YOUR_API_KEY', 'ethereum')

// Override chain for specific requests
const result = await birdeye.token.overview({
  address: 'TOKEN_ADDRESS'
}, { chain: 'ethereum' })
```

## License

MIT

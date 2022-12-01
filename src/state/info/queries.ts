// export const tokensQuery = (amount: number) => {
//   return {
//     query:
//       'query tokens { tokens(first: ' +
//       amount +
//       ', orderBy: tradeVolumeUSD orderDirection: desc) {  id name symbol tradeVolumeUSD totalLiquidity derivedETH }  }',
//   }
// }

export const tokensQuery = (amount: number, block: string) => {
  return {
    query:
      'query { tokens(' +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      'first: ' +
      amount +
      ', orderBy: tradeVolumeUSD orderDirection: desc) {  id name symbol tradeVolumeUSD totalLiquidity derivedETH }  }',
  }
}

export const transactionsQuery = (amount: number) => {
  return {
    query:
      'query transactions {' +
      '    transactions(first: ' +
      amount +
      ', orderBy: timestamp, orderDirection: desc) {' +
      '      swaps(orderBy: timestamp, orderDirection: desc) {' +
      '        transaction {' +
      '          id' +
      '          timestamp' +
      '        }' +
      '        pair {' +
      '          token0 {' +
      '            id' +
      '            symbol' +
      '          }' +
      '          token1 {' +
      '            id' +
      '            symbol' +
      '          }' +
      '        }' +
      '        amount0In' +
      '        amount0Out' +
      '        amount1In' +
      '        amount1Out' +
      '        amountUSD' +
      '        to' +
      '      }' +
      'mints(orderBy: timestamp, orderDirection: desc) {\n' +
      '      transaction {\n' +
      '        id\n' +
      '        timestamp\n' +
      '      }\n' +
      '      pair {\n' +
      '        token0 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '        token1 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '      }\n' +
      '      to\n' +
      '      liquidity\n' +
      '      amount0\n' +
      '      amount1\n' +
      '      amountUSD\n' +
      '      __typename\n' +
      '    }\n' +
      '    burns(orderBy: timestamp, orderDirection: desc) {\n' +
      '      transaction {\n' +
      '        id\n' +
      '        timestamp\n' +
      '      }\n' +
      '      pair {\n' +
      '        token0 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '        token1 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '      }\n' +
      '      sender\n' +
      '      liquidity\n' +
      '      amount0\n' +
      '      amount1\n' +
      '      amountUSD\n' +
      '    }' +
      '    }' +
      '  }',
  }
}

export const nativePricesQuery = {
  query: 'query bundles { bundles {id ethPrice }}',
}

// export const daysDataQuery = (oneDayBack: number) => {
//   return {
//     query:
//       'query uniswapDayDatas {' +
//       '    uniswapDayDatas(first: 1, skip: 0, where: { date_gt: ' +
//       oneDayBack +
//       ' }, orderBy: date, orderDirection: asc) {' +
//       '      id' +
//       '      date' +
//       '      totalVolumeUSD' +
//       '      dailyVolumeUSD' +
//       '      dailyVolumeETH' +
//       '      totalLiquidityUSD' +
//       '      totalLiquidityETH' +
//       '      txCount' +
//       '    }' +
//       '  }',
//   }
// }
export const daysDataQuery = (oneDayBack: number) => {
  return {
    query:
      'query uniswapDayDatas {' +
      '    uniswapDayDatas(first: 1, skip: 0, where: { date_gt: ' +
      oneDayBack +
      ' }, orderBy: date, orderDirection: asc) {' +
      '      id' +
      '      date' +
      '      totalVolumeUSD' +
      '      dailyVolumeUSD' +
      '      dailyVolumeETH' +
      '      totalLiquidityUSD' +
      '      totalLiquidityETH' +
      '      txCount' +
      '    }' +
      '  }',
  }
}

export const blocksQuery = (startTimestamp: number, currentTimestamp: number) => {
  return {
    query:
      'query blocks { blocks(first: 1 orderBy: timestamp orderDirection: asc where: { timestamp_gt: ' +
      startTimestamp +
      ', timestamp_lt: ' +
      currentTimestamp +
      '}' +
      '    ) {' +
      '      id' +
      '      number' +
      '      timestamp' +
      '    }' +
      '  }',
  }
}

export const uniswapFactoriesQuery = (chainId: string, block: string) => {
  return {
    query:
      'query uniswapFactories { uniswapFactories(' +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      ' where: {id: "' +
      chainId +
      '"}) { id totalVolumeUSD totalVolumeETH untrackedVolumeUSD totalLiquidityUSD totalLiquidityETH txCount pairCount } }',
  }
}

export const pairsQuery = (amount: number, block: string) => {
  return {
    query:
      'query pairs {\n' +
      '  pairs(' +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      'first: ' +
      amount +
      ' orderBy: trackedReserveETH, orderDirection: desc) {\n' +
      '  id\n' +
      '  token0 {\n' +
      '    id\n' +
      '    symbol\n' +
      '    name\n' +
      '  }\n' +
      '  token1 {\n' +
      '    id\n' +
      '    symbol\n' +
      '    name\n' +
      '  }\n' +
      '  reserveUSD\n' +
      '  volumeUSD\n' +
      '  }\n' +
      '}\n',
  }
}

export const tokenDaysDataQuery = (address: string) => {
  return {
    query:
      'query tokenDayDatas {\n' +
      '  tokenDayDatas(first: 30 orderBy: date, orderDirection: desc, where: {token: "' +
      address +
      '"}) {\n' +
      '    id\n' +
      '    token {\n' +
      '      name\n' +
      '      symbol\n' +
      '    }\n' +
      '    date\n' +
      '    priceUSD\n' +
      '    totalLiquidityToken\n' +
      '    totalLiquidityUSD\n' +
      '    totalLiquidityETH\n' +
      '    dailyVolumeETH\n' +
      '    dailyVolumeToken\n' +
      '    dailyVolumeUSD\n' +
      '    dailyTxns\n' +
      '    __typename\n' +
      '  }\n' +
      '}',
  }
}

export const graphQuery = (amount: number) => {
  return {
    query:
      'query uniswapDayDatas { uniswapDayDatas(orderBy: date, orderDirection: desc first: ' +
      amount +
      ') {id date totalVolumeUSD dailyVolumeUSD dailyVolumeETH totalLiquidityUSD totalLiquidityETH } }',
  }
}

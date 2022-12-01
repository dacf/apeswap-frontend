import apePriceGetterABI from 'config/abi/apePriceGetter.json'
import { Token } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getApePriceGetterAddress } from 'utils/addressHelper'
import { getBalanceNumber } from 'utils/formatBalance'

const fetchPrices = async (chainId: number, tokens: Token[]) => {
  const apePriceGetterAddress = getApePriceGetterAddress(chainId)
  const tokensToCall = Object.fromEntries(
    Object.entries(tokens).filter(([, values]) => values.address[chainId] && values.decimals[chainId]),
  )
  const calls = Object.values(tokensToCall).map((token, i) => {
    if (token.lpToken) {
      return {
        address: apePriceGetterAddress,
        name: 'getLPPrice',
        params: [token.address[chainId], token.decimals[chainId]],
      }
    }
    return {
      address: apePriceGetterAddress,
      name: 'getPrice',
      params: [token.address[chainId], token.decimals[chainId]],
    }
  })
  const tokenPrices = await multicall(chainId, apePriceGetterABI, calls)

  // Banana should always be the first token
  const mappedTokenPrices = Object.values(tokensToCall).map((token, i) => {
    return {
      symbol: token.symbol,
      address: token.address,
      price:
        token.symbol === 'GNANA'
          ? getBalanceNumber(tokenPrices[0], token.decimals[chainId]) * 1.389
          : getBalanceNumber(tokenPrices[i], token.decimals[chainId]),
      decimals: token.decimals,
    }
  })
  return mappedTokenPrices
}

export default fetchPrices

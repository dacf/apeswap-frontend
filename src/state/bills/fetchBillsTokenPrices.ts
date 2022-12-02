import apePriceGetterABI from 'config/abi/apePriceGetter.json'
import uniV3PriceGetterABI from 'config/abi/uniV3PriceGetter.json'
import { Address, Decimals, Token } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getBalanceNumber } from 'utils/formatBalance'
import { Bills, LpType } from './types'
import { PRICE_GETTERS } from './constants'

// Need the token as well for uniV3 price getter
type ParsedTokens = {
  token: Token
  address: Address
  decimals: Decimals
  isLp: boolean
  lpType: LpType
}

const fetchBillsTokenPrices = async (chainId: number, bills: Bills[]) => {
  // When adding a new LP types we need to add them to the filter
  const uniV2Tokens: ParsedTokens[] = bills
    .filter((bill) => bill.lpType === LpType.APESWAP)
    ?.flatMap(({ token, quoteToken, lpToken, earnToken, lpType }) => {
      return [
        { token, address: token.address, decimals: token.decimals, isLp: false, lpType },
        {
          token: quoteToken,
          address: quoteToken.address,
          decimals: quoteToken.decimals,
          isLp: false,
          lpType,
        },
        {
          token: earnToken,
          address: earnToken.address,
          decimals: earnToken.decimals,
          isLp: false,
          lpType,
        },
        { token: lpToken, address: lpToken.address, decimals: lpToken.decimals, isLp: true, lpType },
      ]
    })
  const uniV3Tokens: ParsedTokens[] = bills
    .filter((bill) => bill.lpType === LpType.ARRAKIS)
    ?.flatMap(({ token, quoteToken, lpToken, earnToken, lpType }) => {
      return [
        { token, address: token.address, decimals: token.decimals, isLp: false, lpType },
        {
          token: quoteToken,
          address: quoteToken.address,
          decimals: quoteToken.decimals,
          isLp: false,
          lpType,
        },
        {
          token: earnToken,
          address: earnToken.address,
          decimals: earnToken.decimals,
          isLp: false,
          lpType,
        },
        { token: lpToken, address: lpToken.address, decimals: lpToken.decimals, isLp: true, lpType },
      ]
    })

  const uniV2TokenCalls = uniV2Tokens.map(({ address, decimals, isLp, lpType }) => {
    if (isLp) {
      return {
        address: PRICE_GETTERS[chainId][lpType],
        name: 'getLPPrice',
        params: [address[chainId], decimals[chainId]],
      }
    }
    return {
      address: PRICE_GETTERS[chainId][lpType],
      name: 'getPrice',
      params: [address[chainId], decimals[chainId]],
    }
  })

  const uniV3TokenCalls = uniV3Tokens.map(({ token, address, isLp, lpType }) => {
    if (isLp) {
      return {
        address: PRICE_GETTERS[chainId][lpType],
        name: 'getLPPrice',
        params: [token.token0.address[chainId], token.token1.address[chainId], 500, 0],
      }
    }
    return {
      address: PRICE_GETTERS[chainId][lpType],
      name: 'getPrice',
      params: [address[chainId], 0],
    }
  })
  const tokenV2Prices = await multicall(chainId, apePriceGetterABI, uniV2TokenCalls)
  const tokenV3Prices = await multicall(chainId, uniV3PriceGetterABI, uniV3TokenCalls)
  const tokenPrices = [
    ...uniV2Tokens?.map(({ token, address, decimals }, i) => {
      return { symbol: token.symbol, address, price: getBalanceNumber(tokenV2Prices[i], decimals[chainId]), decimals }
    }),
    ...uniV3Tokens.map(({ token, address, decimals }, i) => {
      return { symbol: token.symbol, address, price: getBalanceNumber(tokenV3Prices[i], decimals[chainId]), decimals }
    }),
  ]
  return tokenPrices
}

export default fetchBillsTokenPrices

import { ChainId, Currency, CurrencyAmount, JSBI, Pair, Token, TokenAmount } from '@ape.swap/sdk'
import { ZapType } from '@ape.swap/sdk/dist/constants'
import { createAction } from '@reduxjs/toolkit'
import { PairState } from 'hooks/usePairs'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

type CurrencyOut = {
  outputCurrency: Token
  path: Token[]
  outputAmount: CurrencyAmount
  minOutputAmount: string
}

export type MergedZap = {
  currencyIn: {
    currency: Currency
    inputAmount: JSBI
  }
  currencyOut1: CurrencyOut
  currencyOut2: CurrencyOut
  pairOut: {
    pair: Pair
    pairState: PairState
    inAmount: { token1: string; token2: string }
    minInAmount: { token1: string; token2: string }
    totalPairSupply: TokenAmount
    liquidityMinted: TokenAmount
  }
  chainId: ChainId
  zapType: ZapType
}

export const selectInputCurrency = createAction<{ currencyId: string }>('zap/selectInputCurrency')
export const selectOutputCurrency = createAction<{ currency1: string; currency2: string }>('zap/selectOutputCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('zap/typeInput')
export const replaceZapState = createAction<{
  field: string
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: { currency1: string; currency2: string }
  recipient: string | null
}>('zap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('zap/setRecipient')
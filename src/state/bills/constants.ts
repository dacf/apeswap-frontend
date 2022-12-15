import { ChainId } from '@ape.swap/sdk'
import { getApePriceGetterAddress } from 'utils/addressHelper'
import { LpType } from './types'

export const PRICE_GETTERS: Partial<Record<ChainId, Partial<Record<LpType, string>>>> = {
  [ChainId.BSC]: {
    [LpType.APESWAP]: getApePriceGetterAddress(ChainId.BSC),
  },
  [ChainId.MATIC]: {
    [LpType.APESWAP]: getApePriceGetterAddress(ChainId.MATIC),
    [LpType.ARRAKIS]: '0x0360BFce43D5F4Db628f8E8642B09303AA0d888a',
  },
  [ChainId.TLOS]: {
    [LpType.APESWAP]: getApePriceGetterAddress(ChainId.TLOS),
  },
}

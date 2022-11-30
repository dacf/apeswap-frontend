import { ChainId } from '@ape.swap/sdk'
import apePriceGetterABI from 'config/abi/apePriceGetter.json'
import uniV3PriceGetterABI from 'config/abi/uniV3PriceGetter.json'
import { getApePriceGetterAddress } from 'utils/addressHelper'
import { LpType } from './types'

export const PRICE_GETTERS: Partial<Record<ChainId, Record<LpType, string>>> = {
  [ChainId.MATIC]: {
    [LpType.APESWAP]: getApePriceGetterAddress(ChainId.MATIC),
    [LpType.ARRAKIS]: '0x0360BFce43D5F4Db628f8E8642B09303AA0d888a',
  },
}

export const PRICE_GETTERS_ABI: Partial<Record<ChainId, Record<LpType, any>>> = {
  [ChainId.MATIC]: {
    [LpType.APESWAP]: apePriceGetterABI,
    [LpType.ARRAKIS]: uniV3PriceGetterABI,
  },
}

// import { dualFarmsConfig } from 'config/constants'
import erc20 from 'config/abi/erc20.json'
import miniApeV2 from 'config/abi/miniApeV2.json'
import BigNumber from 'bignumber.js'
import { FarmLpAprsType, TokenPrices } from 'state/types'
import { DualFarmConfig } from 'config/constants/types'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import fetchDualFarmCalls from './fetchDualFarmCalls'
import cleanDualFarmData from './cleanDualFarmData'

const fetchDualFarms = async (
  dFConfig: DualFarmConfig[],
  chainId: number,
  tokenPrices: TokenPrices[],
  bananaPrice: BigNumber,
  farmLpAprs: FarmLpAprsType,
) => {
  const farmIds = []
  const farmCalls = dFConfig.flatMap((farm) => {
    farmIds.push(farm.pid)
    return fetchDualFarmCalls(farm, chainId)
  })
  const vals = await multicall(chainId, [...miniApeV2, ...erc20], farmCalls)
  console.log('vals:::', vals)
  const chunkSize = farmCalls.length / dFConfig.length
  const chunkedFarms = chunk(vals, chunkSize)
  console.log('chunkedFarms:::', chunkedFarms)
  return cleanDualFarmData(farmIds, chunkedFarms, tokenPrices, bananaPrice, farmLpAprs, chainId)
}

export default fetchDualFarms

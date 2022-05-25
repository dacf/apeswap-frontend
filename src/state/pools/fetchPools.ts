import sousChefABI from 'config/abi/sousChef.json'
import bananaABI from 'config/abi/banana.json'
import { TokenPrices } from 'state/types'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import { PoolConfig } from 'config/constants/types'
import fetchPoolCalls from './fetchPoolCalls'
import cleanPoolData from './cleanPoolData'

const fetchPools = async (poolsConfig: PoolConfig[], chainId: number, tokenPrices: TokenPrices[]) => {
  const poolIds = []
  const poolCalls = poolsConfig.flatMap((pool) => {
    console.log('poolInFetchPools:::', pool)
    poolIds.push(pool.sousId)
    return fetchPoolCalls(pool, chainId)
  })
  // We do not want the block time for the banana earn banana pool so we append two null values to keep the chunks even
  const vals = await multicall(chainId, [...sousChefABI, ...bananaABI], poolCalls)
  console.log('pools-vals:::', vals)
  const formattedVals = [null, null, ...vals]
  const chunkSize = formattedVals.length / poolsConfig.length
  const chunkedPools = chunk(formattedVals, chunkSize)
  console.log('chunkedPools:::', chunkedPools)
  return cleanPoolData(poolsConfig, poolIds, chunkedPools, tokenPrices, chainId)
}

export default fetchPools

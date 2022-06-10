import BigNumber from 'bignumber.js'
import { PoolConfig } from 'config/constants/types'
import { TokenPrices } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'

const fetchPoolTokenStatsAndApr = (pool: PoolConfig, tokenPrices: TokenPrices[], totalStaked, chainId: number) => {
  console.log('tokenPrices->APR:::', tokenPrices)
  // Get values needed to calculate apr
  const curPool = pool
  console.log('pool->APR:::', curPool)
  const rewardToken = tokenPrices
    ? tokenPrices.find((token) => pool?.rewardToken && token?.address[chainId] === pool?.rewardToken.address[chainId])
    : pool.rewardToken
  console.log('rewardToken->APR:::', rewardToken)
  const stakingToken = tokenPrices
    ? tokenPrices.find((token) => token?.address[chainId] === pool?.stakingToken.address[chainId])
    : pool.stakingToken
  console.log('stakingToken->APR:::', stakingToken)

  // Calculate apr
  const apr = getPoolApr(stakingToken?.price, rewardToken?.price, getBalanceNumber(totalStaked), curPool?.tokenPerBlock)
  console.log('apr->APR:::', apr)
  return [stakingToken, rewardToken, apr]
}

const cleanPoolData = (
  poolsConfig: PoolConfig[],
  poolIds: number[],
  chunkedPools: any[],
  tokenPrices: TokenPrices[],
  chainId: number,
) => {
  console.log('chunkedPools->cPD:::', chunkedPools)
  console.log('poolsConfig->cPD:::', poolsConfig)
  const data = chunkedPools.map((chunk, index) => {
    const poolConfig = poolsConfig.find((pool) => pool.sousId === poolIds[index])
    const [startBlock, endBlock, totalStaked] = chunk
    const totalStakedFormatted = new BigNumber(totalStaked).toJSON()
    const [stakingToken, rewardToken, apr] = fetchPoolTokenStatsAndApr(
      poolConfig,
      tokenPrices,
      totalStakedFormatted,
      chainId,
    )
    console.log('rewardToken->cPD:::', rewardToken)
    console.log('stakingToken->cPD:::', stakingToken)
    console.log('apr->cPD:::', apr)
    return {
      sousId: poolIds[index],
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: poolConfig?.bonusEndBlock || new BigNumber(endBlock).toJSON(),
      totalStaked: totalStakedFormatted,
      stakingToken,
      rewardToken,
      apr,
    }
  })
  return data
}

export default cleanPoolData

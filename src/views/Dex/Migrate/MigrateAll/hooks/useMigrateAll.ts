import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { MigrateStatus, useMigrateAll } from '../provider'
import { useZapContract } from 'hooks/useContract'
import { JSBI, SMART_ROUTER_ADDRESS } from '@ape.swap/sdk'
import { useUserSlippageTolerance } from 'state/user/hooks'
import BigNumber from 'bignumber.js'
import useTransactionDeadline from 'hooks/useTransactionDeadline'

const useMigrateAllLps = () => {
  const { library, chainId } = useActiveWeb3React()
  const { handleUpdateMigrateLp } = useMigrateAll()
  const zapContract = useZapContract()
  const [allowedSlippage] = useUserSlippageTolerance(true)
  const deadline = useTransactionDeadline()
  const handleMigrateAll = useCallback(
    (migrateLps: MigrateResult[]) => {
      migrateLps.map(async (migrateLp) => {
        const { lpAddress, smartRouter, walletBalance, token0, token1, totalSupply } = migrateLp
        const poolTokenPercentage = parseFloat(walletBalance) / parseFloat(totalSupply)

        const [token0Deposited, token1Deposited] = [
          parseInt((poolTokenPercentage * token0.reserves).toString()),
          parseInt((poolTokenPercentage * token1.reserves).toString()),
        ]
        const [token0MinOut, token1MinOut] = [
          JSBI.divide(
            JSBI.multiply(JSBI.BigInt(token0Deposited), JSBI.BigInt(10000 - allowedSlippage)),
            JSBI.BigInt(10000),
          ),
          JSBI.divide(
            JSBI.multiply(JSBI.BigInt(token1Deposited), JSBI.BigInt(10000 - allowedSlippage)),
            JSBI.BigInt(10000),
          ),
        ]
        const [token0MinIn, token1MinIn] = [
          JSBI.divide(JSBI.multiply(token0MinOut, JSBI.BigInt(10000 - allowedSlippage)), JSBI.BigInt(10000)),
          JSBI.divide(JSBI.multiply(token1MinOut, JSBI.BigInt(10000 - allowedSlippage)), JSBI.BigInt(10000)),
        ]
        handleUpdateMigrateLp(lpAddress, 'migrate', MigrateStatus.PENDING)
        zapContract
          .zapLPMigrator(
            SMART_ROUTER_ADDRESS[chainId][smartRouter],
            lpAddress,
            new BigNumber(walletBalance).times(new BigNumber(10).pow(18)).toString(),
            token0MinOut.toString(),
            token1MinOut.toString(),
            token0MinIn.toString(),
            token1MinIn.toString(),
            deadline.toString(),
          )
          .then((tx) =>
            library
              .waitForTransaction(tx.hash)
              .then(() => handleUpdateMigrateLp(lpAddress, 'migrate', MigrateStatus.COMPLETE))
              .catch(() => handleUpdateMigrateLp(lpAddress, 'migrate', MigrateStatus.INVALID)),
          )
          .catch(() => {
            handleUpdateMigrateLp(lpAddress, 'migrate', MigrateStatus.INVALID)
          })
      })
    },
    [library, deadline, allowedSlippage, zapContract, chainId, handleUpdateMigrateLp],
  )
  return handleMigrateAll
}

export default useMigrateAllLps

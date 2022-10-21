import React from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { Pair, TokenAmount, ZAP_ADDRESS } from '@ape.swap/sdk'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { MigrateLpStatus, MigrateStatus, MIGRATION_STEPS } from '.'
import { Farm, Vault } from 'state/types'

export const setMigrateLpStatus = async (
  migrateLps: MigrateResult[],
  apeswapLps: { pair: Pair; balance: TokenAmount }[],
  farms: Farm[],
  vaults: Vault[],
  migrateMaximizers: boolean,
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
  account,
  chainId,
) => {
  const getMigrateLpStatus = async () => {
    const calls = migrateLps?.map((migrateLp) => {
      return { address: migrateLp.lpAddress, name: 'allowance', params: [account, ZAP_ADDRESS[chainId]] }
    })
    const rawLpAllowances = await multicall(chainId, erc20ABI, calls)
    return migrateLps?.map((migrateLp, i) => {
      return {
        lpAddress: migrateLp.lpAddress,
        status: {
          unstake: parseFloat(migrateLp.stakedBalance) > 0 ? MigrateStatus.INCOMPLETE : MigrateStatus.COMPLETE,
          approveMigrate: new BigNumber(rawLpAllowances[i]).gt(0) ? MigrateStatus.COMPLETE : MigrateStatus.INCOMPLETE,
          migrate:
            parseFloat(migrateLp.walletBalance) > 0 || parseFloat(migrateLp.stakedBalance) > 0
              ? MigrateStatus.INCOMPLETE
              : MigrateStatus.COMPLETE,
          approveStake: MigrateStatus.INCOMPLETE,
          stake: MigrateStatus.INCOMPLETE,
        },
        statusText: 'Some shit',
      }
    })
  }
  const getApeswapLpStatus = async () => {
    return apeswapLps?.map(({ pair }) => {
      const matchedVault = vaults.find(
        (vault) => vault.stakeToken.address[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      const matchedFarm = farms.find(
        (farm) => farm.lpAddresses[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      const migrateVaultAvailable = migrateMaximizers && matchedVault
      return {
        lpAddress: pair.liquidityToken.address,
        status: {
          unstake: MigrateStatus.COMPLETE,
          approveMigrate: MigrateStatus.COMPLETE,
          migrate: MigrateStatus.COMPLETE,
          approveStake: migrateVaultAvailable
            ? new BigNumber(matchedVault?.userData?.allowance).gt(0)
              ? MigrateStatus.COMPLETE
              : MigrateStatus.INCOMPLETE
            : new BigNumber(matchedFarm?.userData?.allowance).gt(0)
            ? MigrateStatus.COMPLETE
            : MigrateStatus.INCOMPLETE,
          stake: MigrateStatus.INCOMPLETE,
        },
        statusText: 'Some shit',
      }
    })
  }
  const migrateLpStatus = await getMigrateLpStatus()
  const apeswapLpStatus = await getApeswapLpStatus()
  setLpStatus([...migrateLpStatus, ...apeswapLpStatus])
}

export const activeIndexHelper = (migrateLpStatus: MigrateLpStatus[]) => {
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map((each) => each[1] === MigrateStatus.COMPLETE),
  )
  for (let i = 0; i < MIGRATION_STEPS.length; i++) {
    if (isComplete.filter((loFlag) => !loFlag[i]).length !== 0) {
      return i
    }
  }
  return 0
}

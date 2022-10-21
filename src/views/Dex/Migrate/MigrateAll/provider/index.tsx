import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MigrateResult, useMigratorBalances } from 'state/zapMigrator/hooks'
import useLpBalances from 'hooks/useLpBalances'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import { activeIndexHelper, setMigrateLpStatus } from './utils'
import { useFarms } from 'state/farms/hooks'
import { usePollVaultUserData, useVaults } from 'state/vaults/hooks'

export const MIGRATION_STEPS: { title: string; description: string }[] = [
  { title: 'Unstake', description: 'some description' },
  { title: 'Approve', description: 'some description' },
  { title: 'Migrate', description: 'some description' },
  { title: 'Approve', description: 'some description' },
  { title: 'Stake', description: 'some description' },
]

export const enum MigrateStatus {
  PENDING = 'pending',
  INCOMPLETE = 'incomplete',
  COMPLETE = 'complete',
  INVALID = 'invalid',
}

interface MigrateProviderProps {
  children: ReactNode
}

export interface MigrateLpStatus {
  lpAddress: string
  status: {
    unstake: MigrateStatus
    approveMigrate: MigrateStatus
    migrate: MigrateStatus
    approveStake: MigrateStatus
    stake: MigrateStatus
  }
  statusText: string
}

interface MigrateContextData {
  activeIndex: number
  setActiveIndexCallback: (activeIndex: number) => void
  setMigrateMaximizersCallback: (migrateMaximizers: boolean) => void
  handleUpdateMigrateLp: (
    lpAddress: string,
    type: 'unstake' | 'approveMigrate' | 'migrate' | 'approveStake' | 'stake',
    status: MigrateStatus,
    statusText?: string,
  ) => void
  migrateMaximizers: boolean
  migrateStakeLps: MigrateResult[]
  migrateWalletLps: MigrateResult[]
  apeswapWalletLps: { pair: Pair; balance: TokenAmount }[]
  migrateLpStatus: MigrateLpStatus[]
}

const MigrateContext = createContext<MigrateContextData>({} as MigrateContextData)

/* eslint-disable react-hooks/exhaustive-deps */
export function MigrateProvider({ children }: MigrateProviderProps) {
  const { account, chainId } = useActiveWeb3React()
  const [migrateMaximizers, setMigrateMaximizers] = useState<boolean>(false)
  const [lpStatus, setLpStatus] = useState<MigrateLpStatus[]>([])
  const { results: migrateLpBalances, valid } = useMigratorBalances()
  const migrateWalletBalances = valid ? migrateLpBalances.filter((bal) => parseFloat(bal.walletBalance) > 0.0) : []
  const migrateStakedBalances = valid ? migrateLpBalances.filter((bal) => parseFloat(bal.stakedBalance) > 0.0) : []
  const [activeIndex, setActiveIndex] = useState(0)
  const apeswapLpBalances = useLpBalances()
  // Since we already need to pull farm and vault data for this page we can use the already fetched approved data
  const farms = useFarms(account)
  const { vaults } = useVaults()
  // Since each vault needs a farm we can filter by just farms
  const filteredLpsForStake = apeswapLpBalances?.filter((lp) =>
    farms?.find((farm) => lp.pair.liquidityToken.address.toLowerCase() === farm.lpAddresses[chainId].toLowerCase()),
  )
  console.log(farms, vaults)
  const farmAndVaultUserDataLoaded = farms?.[0]?.userData !== undefined && vaults?.[0]?.userData !== undefined
  console.log(farmAndVaultUserDataLoaded)
  useMemo(() => {
    setMigrateLpStatus(
      migrateLpBalances,
      filteredLpsForStake,
      farms,
      vaults,
      migrateMaximizers,
      setLpStatus,
      account,
      chainId,
    )
  }, [
    migrateLpBalances.length,
    filteredLpsForStake.length,
    account,
    setLpStatus,
    migrateMaximizers,
    farmAndVaultUserDataLoaded,
    chainId,
  ])

  // Monitor is status change for active index
  useMemo(() => {
    setActiveIndex(activeIndexHelper(lpStatus))
  }, [lpStatus])

  const setActiveIndexCallback = useCallback((activeIndex: number) => setActiveIndex(activeIndex), [])
  const setMigrateMaximizersCallback = useCallback(
    (migrateMaximizers: boolean) => setMigrateMaximizers(migrateMaximizers),
    [],
  )
  const handleUpdateMigrateLp = useCallback(
    (lpAddress, type, status, statusText) => {
      const updatedMigrateLpStatus = lpStatus
      const lpToUpdateIndex = lpStatus.findIndex((migrateLp) => migrateLp.lpAddress === lpAddress)
      const lpToUpdate = {
        ...lpStatus[lpToUpdateIndex],
        status: { ...lpStatus[lpToUpdateIndex].status, [type]: status },
        statusText: statusText,
      }
      updatedMigrateLpStatus[lpToUpdateIndex] = lpToUpdate
      setLpStatus([...updatedMigrateLpStatus])
    },
    [setLpStatus, lpStatus],
  )

  console.log({
    setActiveIndexCallback,
    handleUpdateMigrateLp,
    setMigrateMaximizersCallback,
    activeIndex,
    migrateMaximizers,
    migrateWalletLps: migrateWalletBalances,
    migrateStakeLps: migrateStakedBalances,
    apeswapWalletLps: apeswapLpBalances,
    migrateLpStatus: lpStatus,
  })

  return (
    <MigrateContext.Provider
      value={{
        setActiveIndexCallback,
        handleUpdateMigrateLp,
        setMigrateMaximizersCallback,
        activeIndex,
        migrateMaximizers,
        migrateWalletLps: migrateWalletBalances,
        migrateStakeLps: migrateStakedBalances,
        apeswapWalletLps: apeswapLpBalances,
        migrateLpStatus: lpStatus,
      }}
    >
      {children}
    </MigrateContext.Provider>
  )
}

export function useMigrateAll() {
  const context = useContext(MigrateContext)
  return context
}

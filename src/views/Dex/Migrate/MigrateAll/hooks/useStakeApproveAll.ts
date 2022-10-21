import { Erc20 } from 'config/abi/types'
import { Contract, ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { MigrateStatus, useMigrateAll } from '../provider'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import { useVaults } from 'state/vaults/hooks'
import { useMasterChefAddress, useVaultApeAddressV2 } from 'hooks/useAddress'

const useStakeApproveAll = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const { handleUpdateMigrateLp, migrateMaximizers } = useMigrateAll()
  const masterChefAddress = useMasterChefAddress()
  const vaultAddress = useVaultApeAddressV2()
  const { vaults } = useVaults()

  const handleApproveAll = useCallback(
    (apeswapWalletLps: { pair: Pair; balance: TokenAmount }[]) => {
      apeswapWalletLps.map(async ({ pair }) => {
        const { address: lpAddress } = pair.liquidityToken
        // If maximizers is selected we need to check if one exists first. Otherwise approve the farm
        const matchedVault = vaults.find(
          (vault) => vault.stakeToken.address[chainId].toLowerCase() === lpAddress.toLowerCase(),
        )
        const lpContract = new Contract(lpAddress, IUniswapV2PairABI, getProviderOrSigner(library, account)) as Erc20
        handleUpdateMigrateLp(
          lpAddress,
          'approveStake',
          MigrateStatus.PENDING,
          `Pending ${migrateMaximizers && matchedVault ? 'Maximizer' : 'Farm'} Approval`,
        )
        lpContract
          .approve(migrateMaximizers && matchedVault ? vaultAddress : masterChefAddress, ethers.constants.MaxUint256)
          .then((tx) =>
            library
              .waitForTransaction(tx.hash)
              .then(() => handleUpdateMigrateLp(lpAddress, 'approveStake', MigrateStatus.COMPLETE))
              .catch(() => handleUpdateMigrateLp(lpAddress, 'approveStake', MigrateStatus.INVALID)),
          )
          .catch(() => {
            handleUpdateMigrateLp(lpAddress, 'approveStake', MigrateStatus.INVALID)
          })
      })
    },
    [account, handleUpdateMigrateLp, library, chainId, masterChefAddress, vaults, vaultAddress, migrateMaximizers],
  )
  return handleApproveAll
}

export default useStakeApproveAll

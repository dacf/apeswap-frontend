import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  updateUserStakedBalance,
  updateUserBalance,
  updateNfaStakingUserBalance,
  updateUserNfaStakingStakedBalance,
} from 'state/actions'
import { stake, sousStake, sousStakeBnb, nfaStake } from 'utils/callHelpers'
import track from 'utils/track'
import { CHAIN_ID } from 'config/constants'
import { fetchFarmUserStakedBalances } from 'state/farms/fetchFarmUser'
import { useNetworkChainId } from 'state/hooks'
import { useMasterchef, useMulticallContract, useNfaStakingChef, useSousChef } from './useContract'
import { useMasterChefAddress, useNonFungibleApesAddress } from './useAddress'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const masterChefContract = useMasterchef()
  const masterChefAddress = useMasterChefAddress()
  const multicallContract = useMulticallContract()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserStakedBalances(multicallContract, masterChefAddress, account))
      track({
        event: 'farm',
        chain: chainId,
        data: {
          cat: 'stake',
          amount,
          pid,
        },
      })
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid, chainId, masterChefAddress, multicallContract],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const multicallContract = useMulticallContract()

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }

      track({
        event: 'pool',
        chain: CHAIN_ID,
        data: {
          cat: 'stake',
          amount,
          pid: sousId,
        },
      })

      dispatch(updateUserStakedBalance(multicallContract, chainId, masterChefContract, sousId, account))
      dispatch(updateUserBalance(multicallContract, chainId, sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, multicallContract, chainId],
  )

  return { onStake: handleStake }
}

export const useNfaStake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const multicallContract = useMulticallContract()
  const chainId = useNetworkChainId()
  const nfaAddress = useNonFungibleApesAddress()
  const nfaStakeChefContract = useNfaStakingChef(sousId)

  const handleStake = useCallback(
    async (ids: number[]) => {
      await nfaStake(nfaStakeChefContract, ids, account)
      dispatch(updateUserNfaStakingStakedBalance(multicallContract, chainId, sousId, account))
      dispatch(updateNfaStakingUserBalance(multicallContract, nfaAddress, sousId, account))
    },
    [account, dispatch, nfaStakeChefContract, sousId, nfaAddress, chainId, multicallContract],
  )

  return { onStake: handleStake }
}

export default useStake

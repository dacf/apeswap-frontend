import { CHAIN_ID } from 'config/constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useNetworkChainId, useTokenPrices } from 'state/hooks'
import { JungleFarm, JungleFarmsState, State } from 'state/types'
import { fetchJungleFarmsPublicDataAsync, fetchJungleFarmsUserDataAsync, updateJungleFarmsConfig } from '.'

export const useUpdateJungleFarmsConfig = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(updateJungleFarmsConfig())
  }, [dispatch])
}

export const useLiveJungleFarmsConfig = () => {
  const { data: jungleFarmsConfig }: JungleFarmsState = useSelector((state: State) => state.jungleFarms)
  return { jungleFarmsConfig }
}

export const usePollJungleFarms = () => {
  const chainId = useNetworkChainId()
  const { tokenPrices } = useTokenPrices()
  const { jungleFarmsConfig } = useLiveJungleFarmsConfig()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (chainId === CHAIN_ID.BSC) {
      dispatch(fetchJungleFarmsPublicDataAsync(jungleFarmsConfig, chainId, tokenPrices))
    }
  }, [dispatch, tokenPrices, chainId, jungleFarmsConfig])
}

export const useJungleFarms = (account): JungleFarm[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { jungleFarmsConfig } = useLiveJungleFarmsConfig()

  useEffect(() => {
    if (account && (chainId === CHAIN_ID.BSC || chainId === CHAIN_ID.BSC_TESTNET)) {
      dispatch(fetchJungleFarmsUserDataAsync(jungleFarmsConfig, chainId, account))
    }
  }, [account, dispatch, slowRefresh, chainId, jungleFarmsConfig])

  const farms = useSelector((state: State) => state.jungleFarms.data)
  return farms
}

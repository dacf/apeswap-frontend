import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useNetworkChainId } from 'state/hooks'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { JungleFarm, State, StatsState } from 'state/types'
import { fetchJungleFarmsPublicDataAsync, fetchJungleFarmsUserDataAsync, setInitialJungleFarmDataAsync } from '.'

export const usePollJungleFarms = () => {
  const chainId = useNetworkChainId()
  const { tokenPrices } = useTokenPrices()

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchJungleFarmsPublicDataAsync(chainId, tokenPrices))
  }, [dispatch, tokenPrices, chainId])
}

export const useJungleFarms = (account): JungleFarm[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const farms = useSelector((state: State) => state.jungleFarms.data)

  useEffect(() => {
    if (account) {
      dispatch(fetchJungleFarmsUserDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, farms.length, chainId])

  return farms
}

let prevChainId = null

export const useSetJungleFarms = () => {
  useFetchTokenPrices()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const jungleFarms = useJungleFarms(null)
  useEffect(() => {
    if (jungleFarms.length === 0 || chainId !== prevChainId) {
      dispatch(setInitialJungleFarmDataAsync(chainId))
      prevChainId = chainId
    }
  }, [chainId, jungleFarms.length, dispatch])
}

export const useJungleFarmTags = (chainId: number) => {
  const { Tags }: StatsState = useSelector((state: State) => state.stats)
  const jungleFarmTags = Tags?.[`${chainId}`]?.jungleFarms

  return { jungleFarmTags }
}

export const useJungleFarmOrderings = (chainId: number) => {
  const { Ordering }: StatsState = useSelector((state: State) => state.stats)
  const jungleFarmOrderings = Ordering?.[`${chainId}`]?.jungleFarms

  return { jungleFarmOrderings }
}

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useTokenPrices } from 'state/hooks'
import { Bills, State } from 'state/types'
import { fetchBillsPublicDataAsync, fetchBillsUserDataAsync, fetchUserOwnedBillsDataAsync, updateBillsConfig } from '.'

export const useUpdateBillsConfig = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(updateBillsConfig())
  }, [dispatch])
}

export const useBills = (): Bills[] => {
  const bills = useSelector((state: State) => state.bills.data)
  return bills
}

export const usePollBills = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { tokenPrices } = useTokenPrices()
  const billsConfig = useBills()

  useEffect(() => {
    dispatch(fetchBillsPublicDataAsync(billsConfig, chainId, tokenPrices))
  }, [dispatch, tokenPrices, chainId, billsConfig])
}

export const usePollUserBills = (): Bills[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const billsConfig = useBills()

  useEffect(() => {
    if (account) {
      dispatch(fetchBillsUserDataAsync(billsConfig, chainId, account))
      dispatch(fetchUserOwnedBillsDataAsync(billsConfig, chainId, account))
    }
  }, [account, dispatch, slowRefresh, chainId, billsConfig])
  const bills = useSelector((state: State) => state.bills.data)
  return bills
}

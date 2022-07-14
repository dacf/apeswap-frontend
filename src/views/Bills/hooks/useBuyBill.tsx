import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { userBuyBill } from 'utils/callHelpers'
import { useBillContract } from 'hooks/useContract'
import track from 'utils/track'
import { getBillType } from './getBillType'

// Buy a Bill
const useBuyBill = (billAddress: string, amount: string, lpPrice: number) => {
  const { chainId, account } = useActiveWeb3React()
  const billContract = useBillContract(billAddress)
  const billType: string = getBillType(billAddress, chainId)
  const usdAmount: number = parseFloat(amount) * lpPrice
  const handleBuyBill = useCallback(async () => {
    const tx = await userBuyBill(billContract, account, amount, '108377')
    track({
      event: billType,
      chain: chainId,
      data: {
        cat: 'buy',
        address: billContract.address,
        amount,
        usdAmount,
      },
    })
    return tx
  }, [billContract, amount, account, chainId, billType, usdAmount])

  return { onBuyBill: handleBuyBill }
}

export default useBuyBill

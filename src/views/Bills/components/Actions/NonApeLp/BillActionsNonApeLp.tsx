import React, { useState } from 'react'
import { AutoRenewIcon } from '@apeswapfinance/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { fetchBillsUserDataAsync, fetchUserOwnedBillsDataAsync, updateUserAllowance } from 'state/bills'
import { getEtherscanLink } from 'utils'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useApproveBill from '../../../hooks/useApproveBill'
import { Button } from '@ape.swap/uikit'
import { BuyButton } from '../styles'
import BigNumber from 'bignumber.js'
import { Bills } from 'state/bills/types'
import useBuyBill from 'views/Bills/hooks/useBuyBill'

export const BillActions = ({ bill, buyAmount }: { bill: Bills; buyAmount: string }) => {
  const {
    lpToken,
    contractAddress,
    index,
    lpPrice,
    price,
    maxTotalPayOut,
    totalPayoutGiven,
    earnToken,
    earnTokenPrice,
    userData,
  } = bill
  const showApproveBillFlow = !new BigNumber(bill?.userData?.allowance).gt(0)
  const { stakingTokenBalance } = userData
  const { chainId, account } = useActiveWeb3React()
  const { onApprove } = useApproveBill(lpToken.address[chainId], contractAddress[chainId])
  const { onBuyBill } = useBuyBill(contractAddress[chainId], buyAmount, lpPrice, price)
  const dispatch = useAppDispatch()
  const [pendingTx, setPendingTx] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const bigValue = new BigNumber('0').times(new BigNumber(10).pow(18))
  const billValue = bigValue.div(new BigNumber(price))?.toString()
  const available = new BigNumber(maxTotalPayOut)
    ?.minus(new BigNumber(totalPayoutGiven))
    ?.div(new BigNumber(10).pow(earnToken.decimals[chainId]))
  // threshold equals to 10 usd in earned tokens (banana or jungle token)
  const threshold = new BigNumber(10).div(earnTokenPrice)
  const safeAvailable = available.minus(threshold)

  const handleApprove = async () => {
    setPendingTx(true)
    await onApprove()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Approve Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        toastError(e?.data?.message || t('Error: Please try again.'))
        setPendingTx(false)
      })
    dispatch(updateUserAllowance(chainId, index, account))
    setPendingTx(false)
  }

  const handleBuyBill = async () => {
    setPendingTx(true)
    await onBuyBill()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Buy Bill Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        toastError(e?.data?.message || t('Error: Please try again.'))
        setPendingTx(false)
      })
    dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
    dispatch(fetchBillsUserDataAsync(chainId, account))
    setPendingTx(false)
  }

  return (
    <>
      {showApproveBillFlow ? (
        <Button
          onClick={handleApprove}
          endIcon={pendingTx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingTx}
          fullWidth
        >
          {t('Enable')}
        </Button>
      ) : (
        <BuyButton
          onClick={handleBuyBill}
          endIcon={pendingTx && <AutoRenewIcon spin color="currentColor" />}
          disabled={
            billValue === 'NaN' ||
            parseFloat(billValue) < 0.01 ||
            parseFloat(billValue) > parseFloat(safeAvailable.toString()) ||
            parseFloat(stakingTokenBalance) < parseFloat(buyAmount) ||
            pendingTx ||
            pendingTx
          }
        >
          {t('Buy')}
        </BuyButton>
      )}
    </>
  )
}

export default React.memo(BillActions)

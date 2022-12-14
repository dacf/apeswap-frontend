import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useERC20 } from 'hooks/useContract'
import { calculateGasMargin } from 'utils'

// Approve a bill
const useApproveBill = (tokenAddress: string, billAddress: string) => {
  const tokenContract = useERC20(tokenAddress)
  const handleApprove = useCallback(async () => {
    const gasEstimate = await tokenContract.estimateGas.approve(billAddress, ethers.constants.MaxUint256)
    const tx = await tokenContract
      .approve(billAddress, ethers.constants.MaxUint256, { gasLimit: calculateGasMargin(gasEstimate) })
      .then((trx) => trx.wait())
    return tx
  }, [billAddress, tokenContract])
  return { onApprove: handleApprove }
}

export default useApproveBill

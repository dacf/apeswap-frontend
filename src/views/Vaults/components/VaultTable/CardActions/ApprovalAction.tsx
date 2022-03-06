import React, { useCallback, useState, useRef } from 'react'
import styled from 'styled-components'
import { Skeleton, ButtonSquare } from '@apeswapfinance/uikit'
import { useVaultApeApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'

const StyledButtonSquare = styled(ButtonSquare)`
  font-weight: 600;
`

interface ApprovalActionProps {
  stakingContractAddress: string
  pid: number
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ stakingContractAddress, pid, isLoading = false }) => {
  const stakingTokenContract = useERC20(stakingContractAddress)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const rewardRefReward = useRef(null)
  const { onApprove } = useVaultApeApprove(stakingTokenContract, pid)
  const { t } = useTranslation()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      } else {
        rewardRefReward.current?.rewardMe()
      }
    } catch (e) {
      rewardRefReward.current?.rewardMe()
      console.warn(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <>
      {isLoading ? (
        <Skeleton width="70px" height="52px" />
      ) : (
        <StyledButtonSquare disabled={requestedApproval} onClick={handleApprove}>
          {t('ENABLE')}
        </StyledButtonSquare>
      )}
    </>
  )
}

export default ApprovalAction

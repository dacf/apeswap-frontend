import React, { useState } from 'react'
import useApproveIazoFactory from 'views/Iazos/hooks/useApproveIazoFactory'
import { AutoRenewIcon } from '@apeswapfinance/uikit'
import { useTranslation } from 'contexts/Localization'
import StyledButton from './styles'

interface ApproveCreateIazoProps {
  tokenAddress: string
  disabled: boolean
  approved: boolean
  onPendingApproved: (pendingTrx: boolean) => void
}

const ApproveCreateIazo: React.FC<ApproveCreateIazoProps> = ({
  tokenAddress,
  disabled,
  approved,
  onPendingApproved,
}) => {
  const [pendingTrx, setPendingTrx] = useState(false)
  const { t } = useTranslation()
  const onApprovetokenAddress = useApproveIazoFactory(tokenAddress).onApprove

  return (
    <StyledButton
      onClick={async () => {
        setPendingTrx(true)
        await onApprovetokenAddress()
        setPendingTrx(false)
        onPendingApproved(false)
      }}
      disabled={pendingTrx || approved || disabled}
      endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
    >
      {approved ? t('APPROVED') : t('APPROVE')}
    </StyledButton>
  )
}

export default ApproveCreateIazo

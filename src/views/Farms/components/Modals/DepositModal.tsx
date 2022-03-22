import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  LinkExternal,
  AutoRenewIcon,
  Modal,
  ModalHeader,
  Heading,
  ModalFooter,
  Text,
} from '@apeswapfinance/uikit'
import { ThemeUIStyleObject, Box } from 'theme-ui'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import UnderlinedButton from 'components/UnderlinedButton'

const styles: Record<string, ThemeUIStyleObject> = {
  base: {
    display: 'flex',
    my: 9,
    flexDirection: 'column',
  },
  default: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 4,
    span: {
      fontSize: 2,
      fontWeight: 'normal',
    },
  },
  styled: {
    display: 'flex',
    borderRadius: 'normal',
    padding: 9,
    mb: 9,
    justifyContent: 'space-between',
    alignItems: 'center',
    button: {
      fontWeight: 'normal',
    },
    span: { fontSize: 0 },
    background: 'lvl1',
  },
}

interface DepositModalProps {
  max: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', addLiquidityUrl }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(max))
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    // title={TranslateString(999, 'Stake LP tokens')}
    <Modal handleClose={onDismiss} minWidth="350px">
      <ModalHeader handleClose={onDismiss}>
        <Heading as="h3">{TranslateString(999, 'Stake LP tokens')}</Heading>
      </ModalHeader>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={TranslateString(999, 'Stake')}
      />
      <ModalFooter handleClose={() => onDismiss()}>
        <Button
          fullWidth
          disabled={pendingTx || fullBalance === '0' || val === '0'}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onConfirm(val)
              onDismiss()
            } catch (e) {
              console.error('Transaction Failed')
            } finally {
              setPendingTx(false)
            }
          }}
          endIcon={pendingTx && <AutoRenewIcon spin color="currentColor" />}
          style={{
            borderRadius: '10px',
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Deposit') : TranslateString(464, 'Deposit')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default React.memo(DepositModal)

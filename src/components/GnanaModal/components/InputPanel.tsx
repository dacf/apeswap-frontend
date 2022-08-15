/** @jsxImportSource theme-ui */
import React, { useState, useMemo } from 'react'
import { Text, Flex, Button } from '@ape.swap/uikit'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import TokenSelector from './TokenSelector'
import { InputPanelProps } from './types'
import { styles } from './styles'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import Dots from 'components/Loader/Dots'
import { Spinner } from 'theme-ui'
import { getCurrencyUsdPrice } from 'utils/getTokenUsdPrice'
import { useCurrency } from 'hooks/Tokens'
import { useBananaAddress } from 'hooks/useAddress'

const InputPanel: React.FC<InputPanelProps> = ({
  currency,
  panelText,
  value,
  onUserInput,
  disabled,
  fieldType,
  handleMaxInput,
  fullBalance,
}) => {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const [usdVal, setUsdVal] = useState(null)
  const bananaToken = useCurrency(useBananaAddress())

  useMemo(async () => {
    setUsdVal(null)
    if (currency.symbol === 'GNANA') {
      setUsdVal((await getCurrencyUsdPrice(chainId, bananaToken)) * 1.389)
    } else {
      setUsdVal(await getCurrencyUsdPrice(chainId, currency))
    }
  }, [chainId, currency, bananaToken])

  return (
    <Flex sx={styles.gnanaPanelContainer}>
      {/* Panel Top */}
      <Flex sx={styles.panelTopContainer}>
        <Text sx={styles.panelText}>{panelText}</Text>
        <NumericalInput
          value={value}
          onUserInput={(value) => onUserInput(value)}
          align="left"
          id="token-amount-input"
          disabled={disabled}
          disabledText={disabled}
        />
        <TokenSelector currency={currency} />
      </Flex>

      {/* Panel Bottom */}
      <Flex sx={{ width: '100%', justifyContent: 'space-between', fontWeight: 500 }}>
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled && 0.4,
          }}
        >
          {!usdVal && (value || value === '.') && <Spinner width="15px" height="15px" />}
          <Text size="12px" sx={styles.panelBottomText}>
            {usdVal !== null && value !== '.' && usdVal !== 0 && value && `$${(usdVal * parseFloat(value)).toFixed(2)}`}
          </Text>
        </Flex>
        {account && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text size="12px" sx={{ opacity: 0.8 }}>
              {t('Balance: %balance%', { balance: fullBalance || 'loading' })}
              {!fullBalance && <Dots />}
            </Text>
            {fieldType === Field.INPUT && parseFloat(fullBalance) > 0 && (
              <Button variant="primary" size="sm" sx={{ lineHeight: '0px', ...styles.maxBtn }} onClick={handleMaxInput}>
                {t('MAX')}
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(InputPanel)

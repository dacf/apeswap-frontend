/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { Currency } from '@apeswapfinance/sdk'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { Field as MintField } from 'state/mint/actions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { getCurrencyUsdPrice } from 'utils/getTokenUsdPrice'
import TokenSelector from '../TokenSelector'
import { styles } from './styles'
import { styles as tokenSelectorStyles } from '../TokenSelector/styles'
import { DexPanelProps } from './types'

const DexPanel: React.FC<DexPanelProps> = ({
  value,
  currency,
  onCurrencySelect,
  onUserInput,
  handleMaxInput,
  setTradeValueUsd,
  otherCurrency,
  fieldType,
  panelText,
  lpPair,
  disabled,
  showCommonBases = false,
}) => {
  const [usdVal, setUsdVal] = useState(null)
  const { chainId, account } = useActiveWeb3React()
  const isRemoveLiquidity = !!lpPair
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    isRemoveLiquidity ? lpPair?.liquidityToken ?? undefined : currency ?? undefined,
  )
  const currencyBalance = selectedCurrencyBalance?.toSignificant(6)
  const { t } = useTranslation()

  useMemo(async () => {
    setUsdVal(null)
    setUsdVal(await getCurrencyUsdPrice(chainId, lpPair?.liquidityToken || currency, isRemoveLiquidity))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, currency, isRemoveLiquidity])

  useMemo(async () => {
    if (setTradeValueUsd) {
      setTradeValueUsd(
        isRemoveLiquidity
          ? usdVal * parseFloat(currencyBalance) * (parseFloat(value) / 100)
          : usdVal * parseFloat(value),
      )
    }
  }, [usdVal, value, currencyBalance, isRemoveLiquidity, setTradeValueUsd])

  return (
    <Flex sx={styles.dexPanelContainer}>
      <Flex sx={styles.panelTopContainer}>
        <Text sx={styles.swapDirectionText}>{panelText}</Text>
        <NumericalInput
          value={isRemoveLiquidity ? `${value}%` : value}
          onUserInput={(val) => onUserInput(fieldType, val)}
          removeLiquidity={isRemoveLiquidity}
          align="left"
          id="token-amount-input"
          disabled={disabled}
        />
        {!isRemoveLiquidity ? (
          <TokenSelector
            currency={currency}
            otherCurrency={otherCurrency}
            onCurrencySelect={(selectedCurrency: Currency) => onCurrencySelect(fieldType, selectedCurrency)}
            showCommonBases={showCommonBases}
          />
        ) : (
          <Flex
            sx={{
              ...tokenSelectorStyles.primaryFlex,
              cursor: 'default',
              '&:active': { transform: 'none' },
              ':hover': { background: 'white4' },
            }}
          >
            <DoubleCurrencyLogo currency0={currency} currency1={otherCurrency} size={30} />
            <Text sx={tokenSelectorStyles.tokenText}>
              {currency?.getSymbol(chainId)} - {otherCurrency?.getSymbol(chainId)}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex sx={styles.panelBottomContainer}>
        <Text size="12px" sx={styles.panelBottomText}>
          {usdVal &&
            value !== '.' &&
            value &&
            `$${(lpPair
              ? usdVal * parseFloat(currencyBalance) * (parseFloat(value) / 100)
              : usdVal * parseFloat(value)
            ).toFixed(2)}`}
        </Text>
        {account && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text size="12px" sx={styles.panelBottomText}>
              {t('Balance: %balance%', { balance: currencyBalance || 'loading' })}
            </Text>
            {(fieldType === Field.INPUT ||
              fieldType === MintField.CURRENCY_A ||
              fieldType === MintField.CURRENCY_B ||
              isRemoveLiquidity) &&
              parseFloat(currencyBalance) > 0 && (
                <Flex sx={styles.maxButton} size="sm" onClick={() => handleMaxInput(fieldType)}>
                  <Text color="primaryBright" sx={{ lineHeight: '0px' }}>
                    {t('MAX')}
                  </Text>
                </Flex>
              )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(DexPanel)

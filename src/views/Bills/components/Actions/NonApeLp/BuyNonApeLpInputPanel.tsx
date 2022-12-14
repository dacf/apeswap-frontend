/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import useIsMobile from 'hooks/useIsMobile'
import { styles } from 'components/DualCurrencyPanel/styles'
import React from 'react'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { Bills } from 'state/bills/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Spinner } from 'theme-ui'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Dots from 'components/Loader/Dots'

export const BuyNonAPeLpInputPanel = ({
  onUserInput,
  value,
  bill,
}: {
  onUserInput: (value: string) => void
  value: string
  bill: Bills
}) => {
  const isMobile = useIsMobile()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { token, quoteToken, lpPrice, userData } = bill
  const stakingTokenBalance = userData?.stakingTokenBalance
  const parsedStakingBalance = getFullDisplayBalance(new BigNumber(stakingTokenBalance), 18)
  return (
    <Flex sx={styles.dexPanelContainer}>
      <Flex sx={styles.panelTopContainer}>
        <NumericalInput
          value={value}
          onUserInput={(val) => onUserInput(val)}
          fontSize={isMobile ? '15px' : '22px'}
          removeLiquidity={false}
          align="left"
          id="bill-amount-input"
        />
        <Flex sx={{ padding: '5px 10px', background: 'white4', borderRadius: '10px' }}>
          <ServiceTokenDisplay token1={token.symbol} token2={quoteToken.symbol} noEarnToken size={20} />
          <Text ml="5px" weight={700} size="12px" sx={{ whiteSpace: 'nowrap' }}>
            {token.symbol}-{quoteToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={styles.panelBottomContainer}>
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.4,
          }}
        >
          <Text size="12px" sx={styles.panelBottomText}>
            {!lpPrice && value !== '0.0' ? (
              <Spinner width="15px" height="15px" />
            ) : value !== '0.0' && lpPrice !== 0 && value ? (
              `$${(lpPrice * parseFloat(value)).toFixed(2)}`
            ) : null}
          </Text>
        </Flex>
        {account && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text size="12px" sx={styles.panelBottomText}>
              {t('Balance: %balance%', { balance: parsedStakingBalance || 'loading' })}
              {!parsedStakingBalance && <Dots />}
            </Text>
            {parseFloat(parsedStakingBalance) > 0 && (
              <Flex sx={styles.maxButton} size="sm" onClick={() => onUserInput(parsedStakingBalance)}>
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

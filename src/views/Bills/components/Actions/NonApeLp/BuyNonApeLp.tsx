/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, useModal } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { GetLPButton, styles } from '../styles'
import React, { useState } from 'react'
import { Box } from 'theme-ui'
import { BillValueContainer, TextWrapper } from '../../Modals/styles'
import { BuyProps } from '../types'
import { BuyNonAPeLpInputPanel } from './BuyNonApeLpInputPanel'
import BillActionsNonApeLp from './BillActionsNonApeLp'
import { GetLp } from '../../Modals/NonApeLp/GetLp'

export const BuyNonApeLp = ({ bill, onBillId, onTransactionSubmited }: BuyProps) => {
  const {
    token,
    quoteToken,
    contractAddress,
    price,
    lpPrice,
    earnToken,
    earnTokenPrice,
    maxTotalPayOut,
    totalPayoutGiven,
    billNftAddress,
    index,
  } = bill
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const bigValue = new BigNumber(value).times(new BigNumber(10).pow(18))
  const billValue = bigValue.div(new BigNumber(price))?.toString()
  const available = new BigNumber(maxTotalPayOut)
    ?.minus(new BigNumber(totalPayoutGiven))
    ?.div(new BigNumber(10).pow(earnToken.decimals[chainId]))
  // threshold equals to 10 usd in earned tokens (banana or jungle token)
  const threshold = new BigNumber(10).div(earnTokenPrice)
  const safeAvailable = available.minus(threshold)

  const [onPresentBuyBillsModal] = useModal(<GetLp bill={bill} />, true, true, `getLpModal${index}`)

  return (
    <Flex sx={styles.buyContainer}>
      <Flex sx={{ flexWrap: 'wrap' }}>
        <BuyNonAPeLpInputPanel value={value} onUserInput={setValue} bill={bill} />
      </Flex>
      <Flex sx={styles.detailsContainer}>
        <BillValueContainer>
          <TextWrapper>
            <Text size="12px" pr={1}>
              {t('Bill Value')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {billValue === 'NaN' ? '0' : parseFloat(billValue).toFixed(3)} {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text size="12px">
              {t('Available')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {!available ? '0' : new BigNumber(safeAvailable).toFixed(3)} {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
        </BillValueContainer>
        <Flex sx={{ ...styles.buttonsContainer }}>
          <Box sx={styles.getLpContainer}>
            <GetLPButton variant="secondary" onClick={onPresentBuyBillsModal}>
              <Text sx={{ marginRight: '5px' }}>{t('Get LP')}</Text>
              <Svg icon="ZapIcon" color="yellow" />
            </GetLPButton>
          </Box>
          <Box sx={styles.buyButtonContainer}>
            <BillActionsNonApeLp
              bill={bill}
              buyAmount={value}
              onBillId={onBillId}
              onTransactionSubmited={onTransactionSubmited}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

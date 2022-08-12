/** @jsxImportSource theme-ui */
import React, { useCallback, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Flex, Heading, Button, Text, ChevronRightIcon, Svg, Checkbox } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import { useBananaAddress, useGoldenBananaAddress } from 'hooks/useAddress'
import { useBanana, useTreasury } from 'hooks/useContract'
import { useBuyGoldenBanana } from 'hooks/useGoldenBanana'
import { useToast } from 'state/hooks'
import useApproveTransaction from 'hooks/useApproveTransaction'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import InputPanel from './components/InputPanel'
import UnlockButton from 'components/UnlockButton'
import Dots from 'components/Loader/Dots'
import { gnanaStyles } from './styles'

const Gnana = () => {
  const { account } = useActiveWeb3React()
  const { isDark } = useTheme()
  const MAX_BUY = 5000
  const bananaToken = useCurrency(useBananaAddress())
  const gnanaToken = useCurrency(useGoldenBananaAddress())
  const { t } = useTranslation()
  const [unlimited, setUnlimited] = useState(false)
  const treasuryContract = useTreasury()
  const [processing, setProcessing] = useState(false)
  // BUY GNANA
  const [val, setVal] = useState('0')
  const { handleBuy } = useBuyGoldenBanana()
  const gnanaVal = parseFloat(val) > 0 ? parseFloat(val) * 0.7 : '0'
  const bananaBalance = useTokenBalance(useBananaAddress())
  const { toastSuccess } = useToast()
  const bananaContract = useBanana()
  // SELL GNANA
  const goldenBananaBalance = useTokenBalance(useGoldenBananaAddress())

  // BUY GNANA THINGS
  const fullBananaBalance = useMemo(() => {
    return Number(getFullDisplayBalance(bananaBalance)).toFixed(2)
  }, [bananaBalance])
  const handleSelectMax = useCallback(() => {
    const max = parseInt(fullBananaBalance) < MAX_BUY || unlimited ? fullBananaBalance : MAX_BUY
    setVal(max.toString())
  }, [fullBananaBalance, unlimited, setVal])
  const handleChange = useCallback(
    (val) => {
      setVal(val)
    },
    [setVal],
  )
  const {
    isApproving: isApprovingBanana,
    isApproved: isApprovedBanana,
    handleApprove: handleApproveBanana,
  } = useApproveTransaction({
    onRequiresApproval: async (loadedAccount) => {
      try {
        const response = await bananaContract.allowance(loadedAccount, treasuryContract.address)
        const currentAllowance = new BigNumber(response.toString())
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: async () => {
      const trx = await bananaContract.approve(treasuryContract.address, ethers.constants.MaxUint256)
      return await trx.wait()
    },
    onSuccess: async () => toastSuccess(t('Approved!')),
  })
  const buyGnana = useCallback(async () => {
    try {
      setProcessing(true)
      await handleBuy(val)
      setProcessing(false)
      setVal('0')
    } catch (e) {
      setProcessing(false)
      console.warn(e)
    }
  }, [handleBuy, val])
  const displayMax = unlimited ? 'unlimited' : MAX_BUY

  // SELL GNANA THINGS
  const fullGnanaBalance = useMemo(() => {
    return Number(getFullDisplayBalance(goldenBananaBalance)).toFixed(2)
  }, [goldenBananaBalance])

  const handleCheckBox = useCallback(() => {
    setUnlimited(!unlimited)
  }, [unlimited, setUnlimited])

  const disabled =
    processing ||
    val === '' ||
    parseInt(val) === 0 ||
    parseInt(val) > parseInt(fullBananaBalance) ||
    (parseInt(val) > MAX_BUY && !unlimited)

  const renderActions = () => {
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (isApprovedBanana) {
      return (
        <Button variant="primary" onClick={buyGnana} disabled={disabled} fullWidth>
          {(processing && (
            <>
              {t('LOADING')}
              <Dots />
            </>
          )) ||
            t('CONVERT')}
        </Button>
      )
    }
    if (isApprovingBanana) {
      return (
        <Button variant="primary" onClick={handleApproveBanana} disabled={isApprovingBanana} fullWidth>
          {t('APPROVE CONTRACT')}
        </Button>
      )
    }
  }

  return (
    <Flex sx={gnanaStyles.gnanaContainer}>
      <Flex
        sx={{
          ...gnanaStyles.headsUp,
          backgroundColor: (isDark && '#FFB30026') || 'yellow',
          opacity: (isDark && 1) || 0.7,
        }}
      >
        <Flex sx={gnanaStyles.headsUpHeader}>
          <Heading as="h1" sx={{ ...gnanaStyles.warningHeader, color: (isDark && 'yellow') || 'primaryBright' }}>
            {t('HEADS UP, APES!')}
          </Heading>

          <Flex sx={{ padding: '2px', fontSize: ['14px'] }}>
            <Text sx={gnanaStyles.headsUpDescription}>
              {t(
                'Buying GNANA involves paying a 28% burn fee and a 2% reflect fee for a total cost of 30%. This means that for every 1 BANANA you trade in, you will receive 0.7 GNANA.',
              )}
            </Text>
          </Flex>

          <Button
            variant="text"
            sx={gnanaStyles.learnMoreBtn}
            onClick={() => window.open('https://apeswap.finance/gnana', '_blank')}
          >
            {t('Learn More')} <ChevronRightIcon color="primaryBright" />
          </Button>
        </Flex>
      </Flex>

      <Flex sx={gnanaStyles.transactions}>
        <Flex sx={{ flexDirection: 'column' }}>
          {/* FromTokenInput */}
          {/* <DexPanel value={val} panelText="From" /> */}
          <InputPanel
            panelText="From"
            currency={bananaToken}
            value={val}
            onUserInput={handleChange}
            fieldType={Field.INPUT}
            handleMaxInput={handleSelectMax}
            fullBalance={fullBananaBalance}
            disabled={false}
          />
          <Text
            sx={{
              ...gnanaStyles.displayMax,
              color: !unlimited && parseInt(val) > MAX_BUY ? 'error' : 'text',
            }}
          >
            {t('*Current max conversion is %displayMax% BANANA', { displayMax })}
          </Text>
          {/* DownArrow */}
          <Flex sx={gnanaStyles.arrowDownContainer}>
            <Flex sx={gnanaStyles.arrowDown}>
              <Svg icon="arrow" width="8px" color="primaryBright" />
            </Flex>
          </Flex>
          {/* ToTokenInput */}
          <InputPanel
            panelText="To"
            currency={gnanaToken}
            value={Number(gnanaVal.toString()).toFixed(4)}
            onUserInput={handleChange}
            fieldType={Field.OUTPUT}
            handleMaxInput={handleSelectMax}
            fullBalance={fullGnanaBalance}
            disabled={true}
          />

          <Flex sx={{ marginTop: '20px', alignItems: 'center' }}>
            <Flex sx={gnanaStyles.checkboxContainer}>
              <Checkbox
                id="checkbox"
                checked={unlimited}
                sx={{ backgroundColor: 'white2' }}
                onChange={handleCheckBox}
              />
            </Flex>
            <Text
              sx={{
                ...gnanaStyles.checkboxText,
                color: !unlimited && parseInt(val) > MAX_BUY ? 'error' : 'text',
              }}
            >
              {t('I understand how GNANA works and I want to enable unlimited buy')}
            </Text>
          </Flex>
        </Flex>

        <Flex sx={gnanaStyles.renderActions}>{renderActions()}</Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(Gnana)

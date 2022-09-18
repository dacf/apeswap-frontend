/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { Field, SwapDelay } from 'state/swap/actions'
import { Flex, useModal } from '@ape.swap/uikit'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { computeTradePriceBreakdown } from 'utils/prices'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'contexts/Localization'
import track from 'utils/track'
import { CurrencyAmount, JSBI, Token, Trade } from '@apeswapfinance/sdk'
import {
  useExpertModeManager,
  useIsModalShown,
  useModalTimer,
  useUserRecentTransactions,
  useUserSlippageTolerance,
} from 'state/user/hooks'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import maxAmountSpend from 'utils/maxAmountSpend'
import { dexStyles } from '../styles'
import DexPanel from '../components/DexPanel'
import DexNav from '../components/DexNav'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import SwapSwitchButton from './components/SwapSwitchButton'
import DexActions from './components/DexActions'
import DexTradeInfo from './components/DexTradeInfo'
import LoadingBestRoute from './components/LoadingBestRoute'
import ExpertModeRecipient from './components/ExpertModeRecipient'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import RecentTransactions from '../components/RecentTransactions'
import { useBananaAddress } from 'hooks/useAddress'
import { setFPT, setFPT24, setPrompted } from 'state/user/actions'

const Swap: React.FC = () => {
  // modal and loading
  const { buying: showBuyingModal, selling: showSellingModal } = useIsModalShown()
  const { fPT, fPT24, prompted } = useModalTimer()
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const loadedUrlParams = useDefaultsFromURLSearch()

  const history = useHistory()
  const dispatch = useDispatch()

  const [tradeValueUsd, setTradeValueUsd] = useState(0)

  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [allowedSlippage] = useUserSlippageTolerance()

  const [recentTransactions] = useUserRecentTransactions()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  const { INPUT, OUTPUT, independentField, typedValue, recipient, swapDelay, bestRoute } = useSwapState()

  // the callback to execute the swap
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const [inputCurrency, outputCurrency] = [useCurrency(INPUT?.currencyId), useCurrency(OUTPUT?.currencyId)]
  const bananaToken = useCurrency(useBananaAddress())

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    bestRoute,
  )

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const fetchingBestRoute =
    swapDelay === SwapDelay.USER_INPUT ||
    swapDelay === SwapDelay.FETCHING_SWAP ||
    swapDelay === SwapDelay.FETCHING_BONUS

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(chainId, bestRoute.smartRouter, trade)

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false })) // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash])

  const handleMaxInput = useCallback(
    (field: Field) => {
      if (maxAmountInput) {
        onUserInput(field, maxAmountInput.toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )

  const { routerType } = bestRoute

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(async (hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
        track({
          event: 'swap',
          value: tradeValueUsd,
          chain: chainId,
          data: {
            router: routerType,
            token1: trade?.inputAmount?.currency?.getSymbol(chainId),
            token2: trade?.outputAmount?.currency?.getSymbol(chainId),
            token1Amount: Number(trade?.inputAmount.toSignificant(6)),
            token2Amount: Number(trade?.outputAmount.toSignificant(6)),
          },
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, trade, tradeValueUsd, chainId, t, routerType])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens.filter((token: Token) => {
        return !(token.address in defaultTokens)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [urlLoadedTokens],
  )

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      bestRoute={bestRoute}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'swapConfirmModal',
  )

  // TO DO - Implement this statement (when the user selects BANANA as the input token (for the first time in 24 hours)) for when selling Banana (after 24 hours, reset the showModal setting 'selling' redux state to true)

  // The intent of this one is we want to prompt users BEFORE they sell banana, instead of prompting them after a swap, we'll prompt them when they select BANANA is the input token. The first time they select it as an input token in 24 hours, they will get the warning
  // If they select it twice in a 24 hour timeframe as the input token, we will not show the prompt on the second time around so we don't annoy users

  // Create a redux state (prompted)
  // prompted is false -> Prompt a user with a sell modal for the first time
  // get the `firstPromptedTime` and save it to state
  // we set prompted to true

  // Get the time 24 hrs after the firstPromptedTime
  // save it to state to fPT24

  // whenever you want to show the modal
  // check current time ->
  // if cT > fPT24 -> show modal
  // else don't show modal

  const buyingBanana = outputCurrency === bananaToken
  const sellingBanana = inputCurrency === bananaToken
  console.log('fPT:::', fPT)
  console.log('fPT24:::', fPT24)
  console.log('prompted:::', prompted)
  const showTimedModal = useCallback(() => {
    const displaySellCircular = () => showSellingModal && history.push({ search: '?modal=circular-sell' })

    if (prompted && sellingBanana) {
      console.log('prompted is true and sellingBanana?')
      const cT = Date.now()
      if (cT > fPT24) {
        dispatch(setFPT(cT))
        sellingBanana && displaySellCircular()
        const cT24 = cT + 3600000 * 24
        dispatch(setFPT24(cT24))
      }
    } else if (sellingBanana) {
      console.log('prompted is false && sellingBanana?')
      const fPT = Date.now()
      console.log('firstFPT:::', fPT)
      dispatch(setFPT(fPT))

      displaySellCircular()
      dispatch(setPrompted(!prompted))

      const fPT24 = fPT + 3600000 * 24
      dispatch(setFPT24(fPT24))
    }
  }, [history, showSellingModal, sellingBanana, fPT24, prompted, dispatch])

  useEffect(() => {
    const displayBuyCircular = () => showBuyingModal && txHash && history.push({ search: '?modal=circular-buy' })
    buyingBanana && displayBuyCircular()
    showTimedModal()
  }, [history, buyingBanana, showBuyingModal, txHash, showSellingModal, sellingBanana, showTimedModal])

  return (
    <Flex sx={dexStyles.pageContainer}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={dexStyles.dexContainer}>
          <DexNav />
          <Flex sx={{ margin: '25px 0px', maxWidth: '100%', width: '420px' }} />
          <DexPanel
            value={formattedAmounts[Field.INPUT]}
            panelText="From"
            currency={inputCurrency}
            otherCurrency={outputCurrency}
            setTradeValueUsd={setTradeValueUsd}
            fieldType={Field.INPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            smartRouter={bestRoute.smartRouter}
            independentField={independentField}
            disabled={fetchingBestRoute}
          />
          <SwapSwitchButton onClick={onSwitchTokens} />
          <DexPanel
            value={formattedAmounts[Field.OUTPUT]}
            panelText="To"
            currency={outputCurrency}
            otherCurrency={inputCurrency}
            fieldType={Field.OUTPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={onUserInput}
            smartRouter={bestRoute.smartRouter}
            independentField={independentField}
            disabled={fetchingBestRoute}
          />

          <ExpertModeRecipient
            recipient={recipient}
            showWrap={showWrap}
            isExpertMode={isExpertMode}
            onChangeRecipient={onChangeRecipient}
          />
          {showWrap ? (
            <></>
          ) : fetchingBestRoute ? (
            <LoadingBestRoute />
          ) : (
            <DexTradeInfo
              trade={v2Trade}
              allowedSlippage={allowedSlippage}
              bestRoute={bestRoute}
              swapDelay={swapDelay}
            />
          )}
          <DexActions
            trade={trade}
            wrapInputError={wrapInputError}
            swapInputError={swapInputError}
            isExpertMode={isExpertMode}
            showWrap={showWrap}
            wrapType={wrapType}
            routerType={bestRoute.routerType}
            smartRouter={bestRoute.smartRouter}
            swapCallbackError={swapCallbackError}
            priceImpactWithoutFee={priceImpactWithoutFee}
            userHasSpecifiedInputOutput={userHasSpecifiedInputOutput}
            onWrap={onWrap}
            handleSwap={handleSwap}
            onPresentConfirmModal={onPresentConfirmModal}
            setSwapState={setSwapState}
            disabled={fetchingBestRoute}
          />
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(Swap)

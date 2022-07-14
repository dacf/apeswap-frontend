/** @jsxImportSource theme-ui */
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@apeswapfinance/sdk'
import { Text, Card, Skeleton, Flex, MetamaskIcon } from '@ape.swap/uikit'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { registerToken } from 'utils/wallet'
import { useCombinedActiveList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken, useAllInactiveTokens } from '../../hooks/Tokens'
import { RowBetween } from '../layout/Row'
import { CurrencyLogo } from '../Logo'
import { isTokenOnList } from '../../utils'
import ImportRow from './ImportRow'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
  weight: 400;
  font-size: 14px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance?.toExact()}>{balance?.toSignificant(4)}</StyledBalanceText>
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const { t } = useTranslation()
  const addToMetaMask = () => {
    registerToken(
      currency instanceof Token ? currency?.address : '',
      currency?.symbol,
      currency?.decimals,
      currency instanceof WrappedTokenInfo ? currency?.tokenInfo.logoURI : '',
    ).then(() => '')
  }

  // only show add or remove buttons if not on selected list
  return (
    <Flex
      style={style}
      sx={{
        width: '100%',
        background: 'white3',
        height: '50px',
        cursor: !isSelected && !otherSelected && 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 10px 4px 7px',
        opacity: isSelected || otherSelected ? 0.5 : 1,
        ':hover': {
          background: !isSelected && !otherSelected && 'white4',
        },
      }}
      key={`token-item-${key}`}
      className={`token-item-${key}`}
      onClick={(event) => (event.currentTarget === event.target && isSelected ? null : onSelect())}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <CurrencyLogo currency={currency} size="30px" />
        <Flex sx={{ flexDirection: 'column', ml: '10px', alignItems: 'space-between' }}>
          <Flex sx={{ alignItems: 'center' }}>
            <Text title={currency.getName(chainId)} weight={700} sx={{ lineHeight: '22px' }}>
              {currency.getSymbol(chainId)}
            </Text>
            <MetamaskIcon width="13px" ml="7px" mb="1px" onClick={addToMetaMask} />
          </Flex>
          <Text size="12px" weight={300} sx={{ lineHeight: '16px' }}>
            {!isOnSelectedList && customAdded && t('Added by user •')} {currency.getName(chainId)}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Skeleton width="50px" /> : null}
      </Flex>
    </Flex>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencies] : currencies
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, showETH])

  const inactiveTokens: {
    [address: string]: Token
  } = useAllInactiveTokens()

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)

      const token = wrappedCurrency(currency, chainId)

      const showImport = inactiveTokens && token && Object.keys(inactiveTokens).includes(token.address)

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <Card padding="8px 12px">
              <RowBetween>
                <Text small>{t('Expanded results from inactive Token Lists')}</Text>
              </RowBetween>
            </Card>
          </FixedContentRow>
        )
      }

      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      }
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [
      chainId,
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
      t,
    ],
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      width="100%"
      ref={fixedListRef as any}
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

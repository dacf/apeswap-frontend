/** @jsxImportSource theme-ui */
import React from 'react'
import { Skeleton } from '@apeswapfinance/uikit'
import { Text, Flex } from '@ape.swap/uikit'
import { Currency } from '@apeswapfinance/sdk'
import { CurrencyLogo } from 'components/Logo'
import { styles } from './styles'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const TokenSelector: React.FC<{
  currency: Currency
  disabled?: boolean
}> = ({ currency }) => {
  const { chainId } = useActiveWeb3React()

  return (
    <Flex sx={{ ...styles.primaryFlex }}>
      {currency ? (
        <CurrencyLogo currency={currency} size="30px" />
      ) : (
        <Skeleton width="30px" height="30px" animation="waves" variant="circle" />
      )}
      <Text sx={{ ...styles.tokenText }}>{currency?.getSymbol(chainId)}</Text>
    </Flex>
  )
}

export default React.memo(TokenSelector)

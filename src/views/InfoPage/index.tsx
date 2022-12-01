/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React from 'react'
import { useFetchInfoBlock, useFetchInfoNativePrice } from 'state/info/hooks'
import TrendingTokens from './components/TrendingTokens/TrendingTokens'
import Tokens from './components/Tokens'
import Heading from './components/Heading'
import Pairs from './components/Pairs'
import Transactions from './components/Transactions'
import Overview from './components/Overview'
import NetworkSelector from './components/NetworkSelector'
import useIsMobile from '../../hooks/useIsMobile'
import Showcases from './components/Showcases'

const InfoPage = () => {
  useFetchInfoBlock()
  useFetchInfoNativePrice()
  const mobile = useIsMobile()

  return (
    <Flex sx={{ width: '100%', justifyContent: 'center' }}>
      <Flex
        sx={{
          height: 'fit-content',
          width: 'fit-content',
          maxWidth: '1200px',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '40px 0px',
        }}
      >
        <Heading />
        <NetworkSelector />
        <Overview />
        <TrendingTokens />
        {mobile && <Showcases />}

        <Tokens />
        <Pairs />
        <Transactions />
      </Flex>
    </Flex>
  )
}

export default InfoPage

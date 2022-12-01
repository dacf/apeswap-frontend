/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { CHAIN_PARAMS, MAINNET_CHAINS, NETWORK_INFO_LINK } from 'config/constants/chains'
import React from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'

const Heading = () => {
  const mobile = useIsMobile()

  return (
    <Flex
      sx={{
        width: `${mobile ? '95vw' : '100%'}`,
        maxWidth: '1200px',
        height: 'fit-content',
        padding: '50px',
        background: 'white2',
        borderRadius: '10px',
        mb: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', mb: '20px' }}>
        <Text size="26px" sx={{ textAlign: 'center' }}>
          {' '}
          {`Aggregated DEX Info Page (Beta)`}{' '}
        </Text>
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', mb: '20px' }}>
        <Text size="14px" sx={{ textAlign: 'center' }}>
          {' '}
          {`Select a logo below to view that chain's previous analytics page`}{' '}
        </Text>
      </Flex>
      <Flex>
        {MAINNET_CHAINS.map((chainId) => {
          return (
            <a
              href={NETWORK_INFO_LINK[chainId]}
              target="_blank"
              rel="noopener noreferrer"
              key={chainId}
              sx={{ cursor: 'pointer', margin: '0px 20px' }}
            >
              <Flex>
                <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} />
              </Flex>
            </a>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Heading

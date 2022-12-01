/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { CHAIN_PARAMS, MAINNET_CHAINS } from 'config/constants/chains'
import React from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import { useFetchActiveChains } from '../../../../state/info/hooks'

const NetworkSelector = () => {
  const mobile = useIsMobile()
  const [activeChains, toggleChain] = useFetchActiveChains()

  function isActive(chain) {
    // If active changes equals null it means all chains should be shown
    return activeChains === null || activeChains.filter((x) => x === chain).length > 0
  }

  return (
    <>
      <Flex sx={{ flexDirection: 'column', width: `${mobile ? '95vw' : '100%'}`, mb: '20px' }}>
        <Text size="18px" weight={700}>
          Network Filters
        </Text>
      </Flex>
      <Flex
        sx={{
          width: `${mobile ? '95vw' : '100%'}`,
          maxWidth: '1200px',
          height: 'fit-content',
          padding: '20px',
          background: 'white2',
          borderRadius: '10px',
          mb: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Flex>
          {MAINNET_CHAINS.map((chainId) => {
            return (
              <div
                onClick={() => toggleChain(chainId)}
                key={chainId}
                sx={{
                  background: 'white3',
                  borderRadius: '10px',
                  padding: '10px',
                  cursor: 'pointer',
                  margin: '0px 20px',
                }}
              >
                <Flex sx={{ opacity: `${isActive(chainId) === true ? '100%' : '40%'}` }}>
                  <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} size={30} />
                </Flex>
              </div>
            )
          })}
        </Flex>
      </Flex>
    </>
  )
}

export default NetworkSelector

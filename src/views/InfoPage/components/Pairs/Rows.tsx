/** @jsxImportSource theme-ui */
import { ChainId } from '@ape.swap/sdk'
import { Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { CHAIN_PARAMS } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useIsMobile from 'hooks/useIsMobile'
import React from 'react'
import CountUp from 'react-countup'
import { useFetchInfoPairs } from 'state/info/hooks'
import { Pairs } from 'state/info/types'
import { Grid } from 'theme-ui'

const Rows = ({ pairs, activeIndex }: { pairs: Pairs[]; activeIndex: number }) => {
  const { t } = useTranslation()
  const mobile = useIsMobile()
  const dayOldPairs = useFetchInfoPairs(20, 1) as any
  const get24HourVolume = (chainId: ChainId, id: string) => {
    try {
      const volume = dayOldPairs[chainId]?.data?.find(({ id: curId }) => curId === id)?.volumeUSD
      return parseFloat(volume)
    } catch {
      return 0
    }
  }

  return (
    <Flex
      sx={{
        width: '100%',
        maxWidth: '1200px',
        height: '500px',
        flexDirection: 'column',
        overflowX: 'scroll',
        overflowY: 'hidden',
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Grid
        gap="0px"
        columns={[`.25fr ${mobile ? '1.5fr' : '3fr'} 1.25fr 1.5fr 1.5fr`]}
        sx={{ minHeight: '40px', alignItems: 'center', minWidth: '700px' }}
      >
        <Text pl={3}>#</Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Pair')}
        </Text>{' '}
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Liquidity')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Volume (24hs)')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Total Volume')}
        </Text>
        <span />
      </Grid>
      <Flex sx={{ flexDirection: 'column', height: '500px' }}>
        {pairs.map(({ id, chainId, volumeUSD, reserveUSD, token0, token1 }, index) => {
          return (
            <Grid
              key={id}
              gap="0px"
              columns={[`.25fr ${mobile ? '2.0fr' : '3.5fr'} 1.25fr 1.5fr 1.5fr`]}
              sx={{
                background: index % 2 === 0 ? 'white3' : 'white2',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '700px',
              }}
            >
              <Flex>
                <Text size="14px" weight={400} pl={4}>
                  {index + 1 + activeIndex}
                </Text>
              </Flex>
              <Flex sx={{ alignItems: 'center' }}>
                <ServiceTokenDisplay
                  token1={token0.symbol}
                  token2={token1.symbol}
                  noEarnToken
                  size={20}
                  tokensMargin={-10}
                />
                <Flex
                  sx={{
                    marginLeft: '-7px',
                    marginTop: '-12px',
                  }}
                >
                  <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} size={12} />
                </Flex>
                <Text size="14px" weight={400} ml="10px">
                  {token0.symbol} - {token1.symbol}
                </Text>
              </Flex>
              <Flex>
                <Text size="14px" weight={400}>
                  $
                  <CountUp
                    start={parseFloat(reserveUSD)}
                    end={parseFloat(reserveUSD)}
                    decimals={3}
                    duration={0}
                    separator=","
                  />
                </Text>
              </Flex>
              <Flex>
                <Text size="14px" weight={400}>
                  $
                  <CountUp
                    start={parseFloat(volumeUSD) - get24HourVolume(chainId, id)}
                    end={parseFloat(volumeUSD) - get24HourVolume(chainId, id)}
                    duration={0}
                    separator=","
                  />{' '}
                </Text>
              </Flex>
              <Flex>
                <Text size="14px" weight={400}>
                  $
                  <CountUp start={parseFloat(volumeUSD)} end={parseFloat(volumeUSD)} duration={0} separator="," />{' '}
                </Text>
              </Flex>
            </Grid>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default React.memo(Rows)

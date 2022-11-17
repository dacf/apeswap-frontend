import React, { useCallback, useEffect, useState } from 'react'
import { Text } from '@apeswapfinance/uikit'
import styled from '@emotion/styled'
import { useTranslation } from '../../../../contexts/Localization'
import {
  Row,
  Column,
  HeadingWrapper,
  FiguresWrapper,
  BodyWrapper,
  SectionsWrapper,
  Section,
  FavsPlaceholder,
} from '../../styles'
import useTheme from '../../../../hooks/useTheme'
import { InfoPair, InfoToken } from 'views/Info/types'
import { useSelector } from 'react-redux'
import { State } from '../../../../state/types'
import { useFetchInfoPairs } from '../../../../state/info/hooks'
import TrendingTokens from '../../../Homepage/components/TrendingTokens/TrendingTokens'
import PageLoader from '../../../../components/PageLoader'

interface PairsProps {
  amount: number
  nativePrices?: any
  filter?: string
  showFull?: boolean
}

export const HeadingContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 1200px) {
    flex-direction: row;
  }
`

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 1200px) {
    flex-direction: row;
  }
  margin-bottom: 40px;
`

const Pairs: React.FC<PairsProps> = (props) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const pairs = useFetchInfoPairs(props.amount, 0)
  const dayOldPairs = useFetchInfoPairs(props.amount, 1)
  const activeChains = JSON.parse(localStorage.getItem('infoActiveChains'))
  let processedDayOldPairs = []

  function processPairs() {
    const data = []
    for (let i = 0; i < Object.keys(pairs).length; i++) {
      const chain = Object.keys(pairs)[i]
      if (activeChains.includes(Number(chain))) {
        for (let j = 0; j < pairs[chain].data.length; j++) {
          data.push(pairs[chain].data[j])
        }
      }
    }

    if (props.filter) {
      return data
        .filter((x) => x.token0.id === props.filter || x.token1.id === props.filter)
        .sort((a: InfoPair, b: InfoPair) => a.volumeUSD - b.volumeUSD)
        .reverse()
        .slice(0, props.amount)
    }

    return data
      .sort((a: InfoPair, b: InfoPair) => a.volumeUSD - b.volumeUSD)
      .reverse()
      .slice(0, props.amount)
  }

  function get24HourVolume(pair: string) {
    try {
      return processedDayOldPairs.filter((x) => x.id === pair)[0].volumeUSD
    } catch {
      return 0
    }
  }

  function processDayOldPairs() {
    const data = []
    for (let i = 0; i < Object.keys(dayOldPairs).length; i++) {
      const chain = Object.keys(dayOldPairs)[i]
      if (activeChains.includes(Number(chain))) {
        for (let j = 0; j < dayOldPairs[chain].data.length; j++) {
          data.push(dayOldPairs[chain].data[j])
        }
      }
    }

    if (props.filter) {
      return data
        .filter((x) => x.token0.id === props.filter || x.token1.id === props.filter)
        .sort((a: InfoPair, b: InfoPair) => a.volumeUSD - b.volumeUSD)
        .reverse()
        .slice(0, props.amount)
    }

    return data
      .sort((a: InfoPair, b: InfoPair) => a.volumeUSD - b.volumeUSD)
      .reverse()
      .slice(0, props.amount)
  }

  const toggleFav = (pair: string) => {
    let currentFavs = JSON.parse(localStorage.getItem('infoFavPairs'))
    if (currentFavs === null) currentFavs = []

    const index = currentFavs.indexOf(pair, 0)
    if (index > -1) {
      currentFavs.splice(index, 1)
    } else {
      currentFavs.push(pair)
    }

    localStorage.setItem('infoFavPairs', JSON.stringify(currentFavs))
  }

  const favs = JSON.parse(localStorage.getItem('infoFavPairs'))

  const getFavs = () => {
    const favs = JSON.parse(localStorage.getItem('infoFavPairs'))
    return processPairs().filter((x) => favs.includes(x.id))
  }

  const getFavIcon = (pair: string) => {
    if (favs !== null && favs.filter((x) => x === pair).length > 0)
      return `/images/info/fav-yes-${isDark ? 'dark' : 'light'}.svg`

    return `/images/info/fav-no-${isDark ? 'dark' : 'light'}.svg`
  }

  function checkDatasInitialized() {
    let total = 0
    for (let i = 0; i < Object.keys(pairs).length; i++) {
      const chain = Object.keys(pairs)[i]
      total += pairs[chain].initialized === true ? 1 : 0
    }
    for (let i = 0; i < Object.keys(dayOldPairs).length; i++) {
      const chain = Object.keys(dayOldPairs)[i]
      total += dayOldPairs[chain].initialized === true ? 1 : 0
    }

    if (total === Object.keys(pairs).length + Object.keys(dayOldPairs).length) {
      processedDayOldPairs = processDayOldPairs()
      return true
    }
    return false
  }

  return (
    <div>
      {checkDatasInitialized() === true && props.showFull === true && (
        <>
          <HeadingContainer>
            <HeadingWrapper>
              <Text margin="20px 10px 5px 10px" className="heading">
                {t('Favorite Pairs')}
              </Text>
            </HeadingWrapper>
          </HeadingContainer>
          <Container>
            <SectionsWrapper>
              <Section>
                {getFavs().length === 0 ? (
                  <FavsPlaceholder>
                    <img src="/images/info/favs-placeholder.svg" />
                    <Text>Your favorite pairs will appear here</Text>
                  </FavsPlaceholder>
                ) : (
                  <Row>
                    <Column width="18px">&nbsp;&nbsp;</Column>
                    <Column width="18px">{t('#')}</Column>
                    <Column flex="2">{t('Pair')}</Column>
                    <Column>{t('Liquidity')}</Column>
                    <Column>{t('Volume (24h)')}</Column>
                  </Row>
                )}

                {getFavs().map((pair: InfoPair, index: number) => {
                  return (
                    <Row key={pair.id} background={index % 2 === 0}>
                      <Column width="35px">
                        <img
                          className="fav"
                          width="16px"
                          src={getFavIcon(pair.id)}
                          onClick={() => toggleFav(pair.id)}
                        />{' '}
                      </Column>
                      <Column width="18px">{index + 1}</Column>
                      <Column flex="2">
                        <img
                          width="24px"
                          className="logo"
                          src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${pair.token0.symbol}.svg`}
                          onError={(e) => {
                            e.currentTarget.src = `/images/info/unknownToken.svg`
                          }}
                        />
                        <img
                          width="24px"
                          className="logo logo-right"
                          src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${pair.token1.symbol}.svg`}
                          onError={(e) => {
                            e.currentTarget.src = `/images/info/unknownToken.svg`
                          }}
                        />
                        {pair.token0.name}-{pair.token1.name}
                      </Column>
                      <Column>${Math.round(pair.reserveUSD).toLocaleString()}</Column>
                      <Column>${Math.round(pair.volumeUSD - get24HourVolume(pair.id)).toLocaleString()}</Column>
                    </Row>
                  )
                })}
              </Section>
            </SectionsWrapper>
          </Container>

          <TrendingTokens />
        </>
      )}
      <HeadingContainer>
        <HeadingWrapper>
          <Text margin="20px 10px 5px 10px" className="heading">
            {t('Top Pairs')}
          </Text>
          {!props.filter && props.showFull !== false && (
            <Text style={{ float: 'right' }}>
              <a href="/info/pairs">
                See more <img src={`/images/info/arrow-right-${isDark ? 'dark' : 'light'}.svg`} alt="see more" />
              </a>
            </Text>
          )}
        </HeadingWrapper>
      </HeadingContainer>
      <Container>
        <FiguresWrapper>
          <BodyWrapper>
            <Row>
              <Column width="18px">&nbsp;&nbsp;</Column>
              <Column width="18px">{t('#')}</Column>
              <Column flex="2">{t('Pair')}</Column>
              <Column>{t('Liquidity')}</Column>
              <Column>{t('Volume (24h)')}</Column>
            </Row>
            {checkDatasInitialized() === true &&
              processPairs().map((pair: InfoPair, index: number) => {
                return (
                  <Row key={pair.id} background={index % 2 === 0}>
                    <Column width="35px">
                      <img className="fav" width="16px" src={getFavIcon(pair.id)} onClick={() => toggleFav(pair.id)} />{' '}
                    </Column>
                    <Column width="18px">{index + 1}</Column>
                    <Column flex="2">
                      <img
                        width="24px"
                        className="logo"
                        src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${pair.token0.symbol}.svg`}
                        onError={(e) => {
                          e.currentTarget.src = `/images/info/unknownToken.svg`
                        }}
                      />
                      <img
                        width="24px"
                        className="logo logo-right"
                        src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${pair.token1.symbol}.svg`}
                        onError={(e) => {
                          e.currentTarget.src = `/images/info/unknownToken.svg`
                        }}
                      />
                      {pair.token0.name}-{pair.token1.name}
                    </Column>
                    <Column>${Math.round(pair.reserveUSD).toLocaleString()}</Column>
                    <Column>${Math.round(pair.volumeUSD - get24HourVolume(pair.id)).toLocaleString()}</Column>
                  </Row>
                )
              })}
          </BodyWrapper>
        </FiguresWrapper>
      </Container>
      )
    </div>
  )
}

export default Pairs

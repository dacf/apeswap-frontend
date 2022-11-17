import React from 'react'
import { Text } from '@apeswapfinance/uikit'
import styled from '@emotion/styled'
import { useTranslation } from '../../../../contexts/Localization'
import { Row, Column, HeadingWrapper, SectionsWrapper, Section, FavsPlaceholder } from '../../styles'
import useTheme from '../../../../hooks/useTheme'
import { InfoToken } from '../../types'
import { useFetchInfoBlock, useFetchInfoNativePrice, useFetchInfoTokensData } from '../../../../state/info/hooks'
import TrendingTokens from '../../../Homepage/components/TrendingTokens/TrendingTokens'
import PageLoader from '../../../../components/PageLoader'

interface TokensProps {
  amount: number
  nativePrices?: any
  oneDayBlocks?: any
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

const Tokens: React.FC<TokensProps> = (props) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  useFetchInfoBlock()
  const tokens = useFetchInfoTokensData(props.amount, true)
  const dayOldTokens = useFetchInfoTokensData(props.amount)
  const nativePrices = useFetchInfoNativePrice()
  let processedDayOldTokens = []
  const activeChains = JSON.parse(localStorage.getItem('infoActiveChains'))

  function processTokens() {
    const data = []
    for (let i = 0; i < Object.keys(tokens).length; i++) {
      const chain = Object.keys(tokens)[i]
      if (activeChains.includes(Number(chain))) {
        for (let j = 0; j < tokens[chain].data.length; j++) {
          data.push(tokens[chain].data[j])
        }
      }
    }

    return data
      .sort(
        (a: InfoToken, b: InfoToken) =>
          a.totalLiquidity * getNativePrice(a.chain) * a.derivedETH -
          b.totalLiquidity * getNativePrice(b.chain) * b.derivedETH,
      )
      .reverse()
      .slice(0, props.amount)
  }

  function processDayOldTokens() {
    const data = []
    for (let i = 0; i < Object.keys(dayOldTokens).length; i++) {
      const chain = Object.keys(dayOldTokens)[i]
      if (activeChains.includes(Number(chain))) {
        for (let j = 0; j < dayOldTokens[chain].data.length; j++) {
          data.push(dayOldTokens[chain].data[j])
        }
      }
    }

    return data
      .sort(
        (a: InfoToken, b: InfoToken) =>
          a.totalLiquidity * getNativePrice(a.chain) * a.derivedETH -
          b.totalLiquidity * getNativePrice(b.chain) * b.derivedETH,
      )
      .reverse()
      .slice(0, props.amount)
  }

  const getNativePrice = (chain: string) => {
    return nativePrices[chain].data.ethPrice
  }

  const toggleFav = (token: string) => {
    let currentFavs = JSON.parse(localStorage.getItem('infoFavTokens'))
    if (currentFavs === null) currentFavs = []

    const index = currentFavs.indexOf(token, 0)
    if (index > -1) {
      currentFavs.splice(index, 1)
    } else {
      currentFavs.push(token)
    }

    localStorage.setItem('infoFavTokens', JSON.stringify(currentFavs))
  }

  const favs = JSON.parse(localStorage.getItem('infoFavTokens'))

  const getFavs = () => {
    const favs = JSON.parse(localStorage.getItem('infoFavTokens'))
    return processTokens().filter((x) => favs.includes(x.id))
  }

  const getFavIcon = (token: string) => {
    if (favs !== null && favs.filter((x) => x === token).length > 0)
      return `/images/info/fav-yes-${isDark ? 'dark' : 'light'}.svg`

    return `/images/info/fav-no-${isDark ? 'dark' : 'light'}.svg`
  }

  function get24HourVolume(token: string) {
    try {
      return processedDayOldTokens.filter((x) => x.id === token)[0].tradeVolumeUSD
    } catch {
      return 0
    }
  }

  function checkDatasInitialized() {
    let total = 0
    for (let i = 0; i < Object.keys(tokens).length; i++) {
      const chain = Object.keys(tokens)[i]
      total += tokens[chain].initialized === true ? 1 : 0
    }
    for (let i = 0; i < Object.keys(dayOldTokens).length; i++) {
      const chain = Object.keys(dayOldTokens)[i]
      total += dayOldTokens[chain].initialized === true ? 1 : 0
    }

    if (total === Object.keys(tokens).length + Object.keys(dayOldTokens).length) {
      processedDayOldTokens = processDayOldTokens()
      return true
    }
    return false
  }

  return (
    <div>
      {
        (props.showFull === true && checkDatasInitialized() === true) || props.showFull !== true ? (
          props.showFull === true && (
            <>
              <HeadingContainer>
                <HeadingWrapper>
                  <Text margin="20px 10px 5px 10px" className="heading">
                    {t('Favorite Tokens')}
                  </Text>
                </HeadingWrapper>
              </HeadingContainer>
              <Container>
                <SectionsWrapper>
                  <Section>
                    {getFavs().length === 0 ? (
                      <FavsPlaceholder>
                        <img src="/images/info/favs-placeholder.svg" />
                        <Text>Your favorite tokens will appear here</Text>
                      </FavsPlaceholder>
                    ) : (
                      <Row>
                        <Column width="18px">&nbsp;&nbsp;</Column>
                        <Column width="18px">{t('#')}</Column>
                        <Column flex="2">{t('Token Name')}</Column>
                        <Column>{t('Price')}</Column>
                        <Column className="mobile-hidden">{t('Liquidity')}</Column>
                        <Column className="mobile-hidden">{t('Volume (24h)')}</Column>
                      </Row>
                    )}

                    {checkDatasInitialized() === true &&
                      getFavs().map((token: InfoToken, index: number) => {
                        return (
                          <Row key={token.id} background={index % 2 === 0}>
                            <Column width="35px">
                              <img
                                className="fav"
                                width="16px"
                                src={getFavIcon(token.id)}
                                onClick={() => toggleFav(token.id)}
                              />
                            </Column>
                            <Column width="18px">{index + 1}</Column>
                            <Column flex="2">
                              <img
                                width="24px"
                                className="logo"
                                src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${token.symbol}.svg`}
                                onError={(e) => {
                                  e.currentTarget.src = `/images/info/unknownToken.svg`
                                }}
                              />
                              <a href={`/info/token/${token.chain}/${token.id}`}>
                                {token.name} ({token.symbol})
                              </a>
                            </Column>
                            <Column>
                              $
                              {(
                                Math.round(token.derivedETH * getNativePrice(token.chain) * 100) / 100
                              ).toLocaleString()}
                            </Column>
                            <Column className="mobile-hidden">
                              $
                              {Math.round(
                                token.totalLiquidity * getNativePrice(token.chain) * token.derivedETH,
                              ).toLocaleString()}
                            </Column>
                            <Column className="mobile-hidden">
                              ${Math.round(token.tradeVolumeUSD - get24HourVolume(token.id)).toLocaleString()}
                            </Column>
                          </Row>
                        )
                      })}
                  </Section>
                </SectionsWrapper>
              </Container>
              <TrendingTokens />
            </>
          )
        ) : (
          <PageLoader />
        )

        //If show full (page) and not loaded the display loaded. Don't want to do this for component load because will show multiple loadeds
      }

      <HeadingContainer>
        <HeadingWrapper>
          <Text margin="20px 10px 5px 10px" className="heading">
            {t(props.showFull !== true ? 'Top Tokens' : 'All Tokens')}
          </Text>
          {props.showFull !== true && (
            <Text style={{ float: 'right' }}>
              <a href="/info/tokens">
                See more <img src={`/images/info/arrow-right-${isDark ? 'dark' : 'light'}.svg`} alt="see more" />
              </a>
            </Text>
          )}
        </HeadingWrapper>
      </HeadingContainer>
      <Container>
        <SectionsWrapper>
          <Section>
            <Row>
              <Column width="18px">&nbsp;&nbsp;</Column>
              <Column width="18px">{t('#')}</Column>
              <Column flex="2">{t('Token Name')}</Column>
              <Column>{t('Price')}</Column>
              <Column className="mobile-hidden">{t('Liquidity')}</Column>
              <Column className="mobile-hidden">{t('Volume (24h)')}</Column>
            </Row>
            {checkDatasInitialized() === true &&
              processTokens().map((token: InfoToken, index: number) => {
                return (
                  <Row key={token.id} background={index % 2 === 0}>
                    <Column width="35px">
                      <img
                        className="fav"
                        width="16px"
                        src={getFavIcon(token.id)}
                        onClick={() => toggleFav(token.id)}
                      />
                    </Column>
                    <Column width="18px">{index + 1}</Column>
                    <Column flex="2">
                      <img src={`/images/chains/${token.chain}.png`} width="24px" className="logo" alt="Chain" />
                      <img
                        width="24px"
                        className="logo"
                        alt={token.name}
                        src={`https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${token.symbol}.svg`}
                        onError={(e) => {
                          e.currentTarget.src = `/images/info/unknownToken.svg`
                        }}
                      />
                      <a href={`/info/token/${token.chain}/${token.id}`}>
                        {token.name} ({token.symbol})
                      </a>
                    </Column>
                    <Column>
                      ${(Math.round(token.derivedETH * getNativePrice(token.chain) * 100) / 100).toLocaleString()}
                    </Column>
                    <Column className="mobile-hidden">
                      $
                      {Math.round(
                        token.totalLiquidity * getNativePrice(token.chain) * token.derivedETH,
                      ).toLocaleString()}
                    </Column>
                    <Column className="mobile-hidden">
                      ${Math.round(token.tradeVolumeUSD - get24HourVolume(token.id)).toLocaleString()}
                    </Column>
                  </Row>
                )
              })}
          </Section>
        </SectionsWrapper>
      </Container>
    </div>
  )
}

export default Tokens

import styled from 'styled-components'
import { Heading } from '@apeswapfinance/uikit'

export const HeadingContainer = styled.div`
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
`

export const Header = styled.div`
  position: relative;
  padding-top: 36px;
  padding-left: 10px;
  padding-right: 10px;
  background-image: ${({ theme }) =>
    theme.isDark ? 'url(/images/test-farm-banner.svg)' : 'url(/images/test-farm-banner.svg)'};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  width: 100%;
  height: calc(20vw);
  max-height: 300px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

export const StyledHeading = styled(Heading)`
  font-size: 30px;
  max-width: 176px !important;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 30px;
    max-width: 240px !important;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 44px;
    max-width: 400px !important;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 60px;
    max-width: 600px !important;
  }
`

import styled from 'styled-components'
import { Button, ArrowDropUpIcon, Flex } from '@apeswapfinance/uikit'

export const FarmButton = styled(Button)`
  font-size: 16px;
  font-weight: 700;
  min-width: 129px;
`

export const NextArrow = styled(ArrowDropUpIcon)`
  transform: rotate(90deg);
`

export const Container = styled(Flex)`
  position: relative;
  transform: translateY(-40px);
`

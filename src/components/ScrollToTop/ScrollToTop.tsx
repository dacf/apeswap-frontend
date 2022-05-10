import React from 'react'
import styled from 'styled-components'
import { ChevronUpIcon } from '@ape.swap/uikit'

const StyledChevronUpIcon = styled(ChevronUpIcon)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: rgb(255, 179, 0, 0.7);
  border: 1px solid ${({ theme }) => theme.colors.yellow};
  border-radius: 50%;
  z-index: 10;
  cursor: pointer;
`

export const ScrollToTop = (props: any) => {
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return <StyledChevronUpIcon onClick={scrollToTop} {...props} />
}

export default ScrollToTop

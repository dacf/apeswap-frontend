/** @jsxImportSource theme-ui */
import styled from 'styled-components'
import { ThemeUIStyleObject } from 'theme-ui'

import {
  FarmsM1Icon,
  FarmsM2Icon,
  FarmsM3Icon,
  FarmsM4Icon,
  LendingM1Icon,
  LendingM2Icon,
  LendingM3Icon,
  LendingM4Icon,
  LendingM5Icon,
  PoolsM1Icon,
  PoolsM2Icon,
  PoolsM3Icon,
  PoolsM4Icon,
  Text,
} from '@apeswapfinance/uikit'

export const ModalBody = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    height: 100%;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`
export const RightContent = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 50%;
  }
`
export const StyledText = styled(Text)`
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    text-align: left;
  }
`
export const MiddleHeaderText = styled(StyledText)`
  font-size: 22px;
  line-height: 33px;
`
export const MiddleText = styled(StyledText)`
  font-size: 12px;
  line-height: 14px;
`
export const MiddleButton = styled.button`
  color: ${({ theme }) => theme.colors.yellow};
  text-decoration: underline;
  font-size: 12px;
  border: none;
  background: transparent;
  padding: 0;
  font-weight: 500;

  &:hover {
    cursor: pointer;
  }
`

// FARMS
export const MiniHeaderText = styled(StyledText)`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.yellow};
  text-transform: uppercase;
`
export const MainHeaderText = styled(MiddleHeaderText)`
  font-weight: 700;
`
export const MiniButton = styled(MiddleButton)`
  font-size: 16px;
  line-height: 24px;
`

// LENDING ICONS
export const StyledLendingM1Icon = styled(LendingM1Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledLendingM2Icon = styled(LendingM2Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledLendingM3Icon = styled(LendingM3Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledLendingM4Icon = styled(LendingM4Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledLendingM5Icon = styled(LendingM5Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`

// FARMS ICONS
export const StyledFarmsM1Icon = styled(FarmsM1Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledFarmsM2Icon = styled(FarmsM2Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledFarmsM3Icon = styled(FarmsM3Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledFarmsM4Icon = styled(FarmsM4Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`

// POOLS ICONS
export const StyledPoolsM1Icon = styled(PoolsM1Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledPoolsM2Icon = styled(PoolsM2Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledPoolsM3Icon = styled(PoolsM3Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const StyledPoolsM4Icon = styled(PoolsM4Icon)`
  width: 240px;
  height: 120px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
    height: 201px;
  }
`
export const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    flexDirection: 'column',
    mt: ['15px', '15px', '30px'],
    gap: '5px',
    height: ['150px', '150px', '200px'],
  },
  step: {
    fontSize: '10px',
    lineHeight: '14px',
    fontWeight: 700,
    color: 'yellow',
    textTransform: 'uppercase',
  },
  head: {
    fontSize: ['12px', '12px', '22px'],
    lineHeight: '14px',
    fontWeight: 700,
    textTransform: ['uppercase', 'uppercase', 'capitalize'],
    mb: [0, 0, '10px'],
  },
  yellow: {
    color: 'yellow',
    lineHeight: ['16px', '16px', '21px'],
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: ['12px', '12px', '14px'],
  },
  content: {
    fontSize: ['12px', '12px', '14px'],
    fontWeight: [400, 400, 500],
    lineHeight: ['16px', '16px', '21px'],
  },
  tipTitle: {
    fontWeight: 700,
  },
  tipBody: {
    fontWeight: 500,
    fontStyle: 'normal',
  },
}

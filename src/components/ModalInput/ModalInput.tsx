import React from 'react'
import styled from 'styled-components'
import { Box, ThemeUIStyleObject } from 'theme-ui'
import { Text, Button, Input, InputProps, Flex, Link, Heading } from '@apeswapfinance/uikit'
import useI18n from '../../hooks/useI18n'

const styles: Record<string, ThemeUIStyleObject> = {
  base: {
    display: 'flex',
    my: 9,
    flexDirection: 'column',
  },
  default: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 4,
    span: {
      fontSize: 2,
      fontWeight: 'normal',
    },
  },
  styled: {
    display: 'flex',
    borderRadius: 'normal',
    padding: 4,
    mb: 9,
    justifyContent: 'space-between',
    alignItems: 'center',
    span: { fontSize: 0 },
    background: 'lvl1',
  },
}

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  displayDecimals?: number
}

// const getBoxShadow = ({ isWarning = false, theme }) => {
//   if (isWarning) {
//     return theme.shadows.warning
//   }

//   return theme.shadows.inset
// }

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white3};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 40px;
  margin: 0 8px;
  padding: 0 8px;
  font-weight: 800;
  border: none;
  outline: none;
  background-color: ${({ theme }) => theme.colors.white3};

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 80px;
  }
`

const StyledButton = styled(Button)`
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.primaryBright};
  font-weight: 500;
  font-size: 16px;
  padding: 3px 10px;
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  displayDecimals,
}) => {
  const TranslateString = useI18n()
  const isBalanceZero = max === '0' || !max

  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(displayDecimals || 4)

  return (
    <>
      {/* <div style={{ position: 'relative' }}>
        <StyledTokenInput icon={isBalanceZero ? 'error' : 'logo'}>
          <Flex justifyContent="space-between" pl="16px">
            <Text fontSize="14px" fontWeight={800}>
              {inputTitle}
            </Text>
            <Text fontSize="16px" fontWeight={500}>
              {TranslateString(999, 'Balance')}: {displayBalance.toLocaleString()}
            </Text>
          </Flex>
          <Flex alignItems="flex-end" justifyContent="space-around">
            <StyledInput onChange={onChange} placeholder="0" value={value} />
            <StyledButton size="sm" onClick={onSelectMax} mr="8px">
              {TranslateString(452, 'Max'.toUpperCase())}
            </StyledButton>
            <Text fontSize="16px" fontWeight={600}>
              {symbol}
            </Text>
          </Flex>
        </StyledTokenInput>
        {isBalanceZero && (
          <StyledErrorMessage fontSize="14px" color="error">
            No tokens to stake:{' '}
            <Link fontSize="14px" href={addLiquidityUrl} external color="error" fontWeight={600}>
              {TranslateString(999, 'get')} {symbol}
            </Link>
          </StyledErrorMessage>
        )}
      </div> */}

      <Box sx={styles.base}>
        <Box sx={styles.styled}>
          <Button size="sm">MAX</Button>
          <Box sx={{ textAlign: 'right' }}>
            <StyledInput onChange={onChange} placeholder="0" value={value} />
            <Text>~$607.34455</Text>
          </Box>
        </Box>
        <Box sx={styles.default}>
          <Heading as="h5">BANANA</Heading>
          <Text>
            {TranslateString(999, 'Balance')}: {displayBalance.toLocaleString()}
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default ModalInput

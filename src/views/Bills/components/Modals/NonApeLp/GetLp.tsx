/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, ModalProvider, Modal, Text, Button, Skeleton } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import ERC20_INTERFACE from 'config/abi/erc20'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMultipleContractSingleData } from 'lib/hooks/multicall'
import { Bills } from 'state/bills/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { SlideTemplate } from './SlideTemplate'
import useIsMobile from 'hooks/useIsMobile'
import SwiperProvider from 'contexts/SwiperProvider'
import { MobileSlides } from './MobileSlides'

export const GetLp = ({ bill, onDismiss }: { bill: Bills; onDismiss: () => void }) => {
  const { chainId, account } = useActiveWeb3React()
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const [tokenBalanceResp, quoteTokenBalanceResp] = useMultipleContractSingleData(
    [bill.token.address[chainId], bill.quoteToken.address[chainId]],
    ERC20_INTERFACE,
    'balanceOf',
    [account],
  )
  const tokenBalance = getBalanceNumber(
    new BigNumber(tokenBalanceResp.result?.toString()),
    bill.token.decimals[chainId],
  )
  const quoteTokenBalance = getBalanceNumber(
    new BigNumber(quoteTokenBalanceResp.result?.toString()),
    bill.quoteToken.decimals[chainId],
  )

  const bigValue = new BigNumber(bill?.userData?.stakingTokenBalance)
  const billValue = bigValue.div(new BigNumber(bill?.price))?.toFixed(6)

  const slides: React.ReactNode[] = [
    <SlideTemplate
      key="slide-1"
      image={'images/bills-modal-1.svg'}
      title={'Step 1'}
      description={'Acquire the tokens of the selected bill.'}
      action={
        <Button
          fullWidth
          onClick={() => window.open('https://app.uniswap.org/#/swap', '_blank', 'noopener,noreferrer')}
        >
          {t('Buy Tokens')}
        </Button>
      }
      extraInformation={
        <Flex sx={styles.extraInfoContainer}>
          <Flex sx={{ mb: '10px' }}>
            <Text> {t('Token Balances')}</Text>
          </Flex>
          <Flex sx={{ justifyContent: 'space-around', width: '100%' }}>
            <Flex>
              <ServiceTokenDisplay token1={bill.token.symbol} size={20} />
              {!isNaN(tokenBalance) ? (
                <Text ml="5px" size="14px" weight={400}>
                  {tokenBalance.toFixed(6)}
                </Text>
              ) : (
                <Skeleton width="35px" animation="waves" />
              )}
            </Flex>
            <Flex>
              <ServiceTokenDisplay token1={bill.quoteToken.symbol} size={20} />
              {!isNaN(quoteTokenBalance) ? (
                <Text ml="5px" size="14px" weight={400}>
                  {quoteTokenBalance.toFixed(6)}
                </Text>
              ) : (
                <Skeleton width="35px" animation="waves" />
              )}
            </Flex>
          </Flex>
        </Flex>
      }
    />,
    <SlideTemplate
      key="slide-2"
      image={'images/bills-modal-2.svg'}
      title={'Step 2'}
      description={'Go to Arrakis and add liquidity.'}
      action={
        <Button
          fullWidth
          onClick={() =>
            window.open(
              `https://beta.arrakis.finance/vaults/${chainId}/${bill.lpToken.address[chainId]}`,
              '_blank',
              'noopener,noreferrer',
            )
          }
        >
          {t('Add Liquidity')}
        </Button>
      }
      extraInformation={
        <Flex sx={styles.extraInfoContainer}>
          <Flex sx={{ mb: '10px' }}>
            <Text>{t('Arrakis LP Balance')}</Text>
          </Flex>
          <Flex>
            <ServiceTokenDisplay token1={bill.token.symbol} token2={bill.quoteToken.symbol} noEarnToken size={20} />
            {bill?.userData?.stakingTokenBalance ? (
              <Text ml="5px" size="14px" weight={400}>
                {getBalanceNumber(new BigNumber(bill?.userData?.stakingTokenBalance), 18).toFixed(6)}
              </Text>
            ) : (
              <Skeleton width="35px" animation="waves" />
            )}
          </Flex>
        </Flex>
      }
    />,
    <SlideTemplate
      key="slide-3"
      image={'images/bills-modal-3.svg'}
      title={'Step 3'}
      description={'Go back to ApeSwap Bills page, and buy the Treasury Bill.'}
      action={
        <Button fullWidth disabled={parseFloat(bill?.userData?.stakingTokenBalance) === 0} onClick={onDismiss}>
          {t('Buy a Bill')}
        </Button>
      }
      extraInformation={
        <Flex sx={styles.extraInfoContainer}>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text mb="10px">{t('Purchasing Power')}</Text>
            <Text>
              {billValue} {bill.earnToken.symbol}
            </Text>
          </Flex>
        </Flex>
      }
    />,
  ]

  return (
    <ModalProvider>
      <Modal
        onDismiss={onDismiss}
        title="How to get liquidity"
        minWidth={isMobile ? '300px' : '825px'}
        maxWidth={isMobile ? '325px' : 'auto'}
      >
        {!isMobile ? (
          <Flex sx={{ justifyContent: 'space-between', maxWidth: '100%' }}>{slides.map((slide) => slide)}</Flex>
        ) : (
          <SwiperProvider>
            <MobileSlides slides={slides} />
          </SwiperProvider>
        )}
      </Modal>
    </ModalProvider>
  )
}

const styles = {
  extraInfoContainer: {
    width: '100%',
    height: '100px',
    background: 'white3',
    border: '3px solid',
    borderColor: 'white4',
    borderRadius: '10px',
    mt: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
}

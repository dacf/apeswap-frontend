/** @jsxImportSource theme-ui */
import { Flex, ModalProvider, Modal, Text, Link, Button } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import ERC20_INTERFACE, { ERC20_ABI } from 'config/abi/erc20'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useERC20 } from 'hooks/useContract'
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'lib/hooks/multicall'
import React from 'react'
import { Bills } from 'state/bills/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { SlideTemplate } from './SlideTemplate'

export const GetLp = ({ bill }: { bill: Bills }) => {
  const { chainId, account } = useActiveWeb3React()
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
  console.log(tokenBalance, quoteTokenBalance)
  return (
    <ModalProvider>
      <Modal onDismiss={null} title="How to get liquidity">
        <Flex sx={{ justifyContent: 'space-between', maxWidth: '100%', width: '750px' }}>
          <SlideTemplate
            image={'images/eth-bill-step-2.svg'}
            title={'Step 1'}
            description={'Acquire the tokens of the selected bill.'}
            action={
              <Button
                fullWidth
                disabled={false}
                as={Link}
                href="https://app.uniswap.org/#/swap"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Tokens
              </Button>
            }
            extraInformation={
              <Flex sx={styles.extraInfoContainer}>
                <Flex>
                  <Text>Token Balance</Text>
                </Flex>
              </Flex>
            }
          />
          <SlideTemplate
            image={'images/eth-bill-step-2.svg'}
            title={'Step 2'}
            description={'Go to Arrakis and add liquidity.'}
            action={
              <Button fullWidth disabled={true}>
                Add Liquidity
              </Button>
            }
            extraInformation={
              <Flex sx={styles.extraInfoContainer}>
                <Flex>
                  <Text>Arrakis LP Balance</Text>
                </Flex>
              </Flex>
            }
          />
          <SlideTemplate
            image={'images/eth-bill-step-2.svg'}
            title={'Step 3'}
            description={'Go back to ApeSwap Bills page, and buy the Treasury Bill.'}
            action={
              <Button fullWidth disabled={true} onClick={null}>
                Buy a Bill
              </Button>
            }
            extraInformation={
              <Flex sx={styles.extraInfoContainer}>
                <Flex>
                  <Text>Purchasing Power</Text>
                </Flex>
              </Flex>
            }
          />
        </Flex>
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
  },
}

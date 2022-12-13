import { Flex, Skeleton } from '@apeswapfinance/uikit'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { Bills } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Claim from '../../Actions/Claim'
import { BillCardsContainer, CardContainer } from '../styles'
import BillModal from '../../Modals'
import { LpTypeVariants } from 'components/ListViewV2/types'
import ListViewContent from 'components/ListViewV2/ListViewContent'

const CardView: React.FC<{ bills: Bills[]; showClaimed: boolean }> = ({ bills, showClaimed }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const billsCardView = bills.flatMap((bill) => {
    const ownedBills = bill?.userOwnedBillsData
    return ownedBills?.flatMap((ownedBill, i) => {
      if (!showClaimed && parseFloat(ownedBill.pendingRewards) === 0 && parseFloat(ownedBill.payout) === 0) {
        return []
      }
      const pendingRewards = getBalanceNumber(
        new BigNumber(ownedBill.pendingRewards),
        bill?.earnToken?.decimals[chainId],
      )?.toFixed(4)
      const ownedBillNftData = bill?.userOwnedBillsNftData ? bill?.userOwnedBillsNftData[i] : null
      return (
        <CardContainer>
          {ownedBillNftData?.image ? (
            <BillModal
              bill={bill}
              billId={ownedBill.id}
              billCardImage={`${ownedBillNftData?.image + '?img-width=720'}`}
            />
          ) : (
            <Skeleton width="270px" height="159px" />
          )}
          <Flex
            padding="0px 15px"
            alignItems="center"
            justifyContent="space-between"
            style={{ height: '75px', width: '100%' }}
          >
            <ListViewContent tag={LpTypeVariants.APE} value={bill.lpToken.symbol} height={50} width={130} />
            <ListViewContent
              title={t('Claimable')}
              value={pendingRewards}
              height={50}
              width={60}
              justifyContent="flex-end"
            />
          </Flex>
          <Claim
            billAddress={bill.contractAddress[chainId]}
            billIds={[ownedBill.id]}
            pendingRewards={ownedBill?.pendingRewards}
            margin={'0 20px 20px 20px'}
          />
        </CardContainer>
      )
    })
  })

  return <BillCardsContainer>{billsCardView}</BillCardsContainer>
}

export default React.memo(CardView)

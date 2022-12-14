/** @jsxImportSource theme-ui */
import React, { useCallback } from 'react'
import { Flex, useMatchBreakpoints } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { Bills, UserBill } from 'state/bills/types'
import { ExtendedListViewProps } from 'components/ListView/types'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Claim from '../../Actions/Claim'
import VestedTimer from '../../VestedTimer'
import BillModal from '../../Modals'
import EmptyListComponent, { EmptyComponentType } from '../../EmptyListComponent/EmptyList'
import { BillsView } from '../../../index'
import ListViewContentMobile from 'components/ListViewV2/ListViewContentMobile'
import { Box } from 'theme-ui'
import CardView from './CardView'
import orderBy from 'lodash/orderBy'
import useCurrentTime from 'hooks/useTimer'
import { LpTypeVariants } from 'components/ListViewV2/types'
import ListViewContent from 'components/ListViewV2/ListViewContent'

const UserBillsRows: React.FC<{
  bills: Bills[]
  showClaimed?: boolean
  listView: boolean
  handleBillsViewChange: (view: BillsView) => void
  noResults: boolean
  sortOption: string
}> = ({ bills, showClaimed, handleBillsViewChange, noResults, listView, sortOption }) => {
  const { isXl, isLg, isXxl } = useMatchBreakpoints()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const isMobile = !isLg && !isXl && !isXxl
  const currentTime = useCurrentTime() / 1000

  const sortBills = useCallback(
    (billsToSort: UserBill[]) => {
      const sorting = (bills) => {
        switch (sortOption) {
          case 'sort':
            return bills.reverse()
          case 'claimable':
            return orderBy(bills, (bill) => parseFloat(bill.billData.pendingRewards), 'desc')
          case 'pending':
            return orderBy(bills, (bill) => parseFloat(bill.billData.pending), 'desc')
          case 'vested':
            return orderBy(
              bills,
              (bill) => parseInt(bill.billData.time) + parseInt(bill.billData.vesting) - currentTime,
              'asc',
            )
          default:
            return bills.reverse()
        }
      }
      return sorting(billsToSort)
    },
    [currentTime, sortOption],
  )

  const billsListView = bills.flatMap((bill) => {
    const ownedBills = bill?.userOwnedBillsData
    const { token, quoteToken, earnToken } = bill
    return ownedBills.flatMap((ownedBill) => {
      if (!showClaimed && parseFloat(ownedBill.pendingRewards) === 0 && parseFloat(ownedBill.payout) === 0) {
        return []
      }
      const pending = getBalanceNumber(new BigNumber(ownedBill.payout), bill?.earnToken?.decimals[chainId])?.toFixed(4)
      const pendingRewards = getBalanceNumber(
        new BigNumber(ownedBill.pendingRewards),
        bill?.earnToken?.decimals[chainId],
      )?.toFixed(4)
      return {
        billData: { pendingRewards, pending, time: ownedBill.lastBlockTimestamp, vesting: ownedBill.vesting },
        tokens: { token1: token.symbol, token2: quoteToken.symbol, token3: earnToken.symbol },
        stakeLp: true,
        id: ownedBill.id,
        billArrow: true,
        title: (
          <ListViewContent
            tag={LpTypeVariants.APE}
            value={bill.lpToken.symbol}
            width={isMobile ? 150 : 150}
            height={45}
            ml={10}
          />
        ),
        titleContainerWidth: 255,
        cardContent: (
          <>
            {isMobile ? (
              <ListViewContentMobile
                title={'Claimable'}
                value={pendingRewards}
                toolTip={`This is the amount of tokens that have vested and available to claim.`}
                toolTipPlacement={'bottomLeft'}
                toolTipTransform={'translate(29%, 0%)'}
              />
            ) : (
              <>
                <ListViewContent
                  title={t('Claimable')}
                  value={pendingRewards}
                  width={isMobile ? 120 : 165}
                  ml={20}
                  height={52.5}
                  toolTip={t('This is the amount of tokens that have vested and available to claim.')}
                  toolTipPlacement="bottomLeft"
                  toolTipTransform="translate(29%, -4%)"
                />
                <ListViewContent
                  title={t('Pending')}
                  value={pending}
                  width={isMobile ? 120 : 160}
                  height={52.5}
                  toolTip={t('This is the amount of unvested tokens that cannot be claimed yet.')}
                  toolTipPlacement="bottomLeft"
                  toolTipTransform="translate(22%, -4%)"
                />
                <VestedTimer lastBlockTimestamp={ownedBill.lastBlockTimestamp} vesting={ownedBill.vesting} />
                <Flex sx={{ minWidth: '220px', alignItems: 'center' }}>
                  <Claim
                    billAddress={bill.contractAddress[chainId]}
                    billIds={[ownedBill.id]}
                    buttonSize={'100px'}
                    pendingRewards={ownedBill?.pendingRewards}
                    margin={'10px'}
                  />
                  <BillModal buttonText={t('VIEW')} bill={bill} billId={ownedBill.id} buttonSize={'100px'} />
                </Flex>
              </>
            )}
          </>
        ),
        expandedContentSize: 185,
        expandedContent: isMobile && (
          <Flex sx={{ width: '100%', flexWrap: 'wrap', padding: '0 10px' }}>
            <Flex sx={{ width: '100%', flexDirection: 'column' }}>
              <ListViewContentMobile
                title={'Pending'}
                value={pending}
                toolTip={`This is the amount of unvested tokens that cannot be claimed yet.`}
                toolTipPlacement={'bottomLeft'}
                toolTipTransform={'translate(22%, 0%)'}
              />
              <VestedTimer lastBlockTimestamp={ownedBill.lastBlockTimestamp} vesting={ownedBill.vesting} mobileFlag />
            </Flex>
            <Flex sx={{ width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ width: '240px', margin: '10px 0' }}>
                <Claim
                  billAddress={bill.contractAddress[chainId]}
                  billIds={[ownedBill.id]}
                  pendingRewards={ownedBill?.pendingRewards}
                  margin={'0'}
                />
              </Box>
              <Box sx={{ width: '240px', mb: 6 }}>
                <BillModal buttonText={t('VIEW')} bill={bill} billId={ownedBill.id} buttonSize={'240px'} />
              </Box>
            </Flex>
          </Flex>
        ),
      }
    })
  })
  const sortedBills = sortBills(billsListView) as ExtendedListViewProps[]

  return (
    <>
      {billsListView?.length ? (
        !listView ? (
          <CardView bills={bills} showClaimed={showClaimed} />
        ) : (
          <ListView listViews={sortedBills} />
        )
      ) : (
        <EmptyListComponent
          type={noResults ? EmptyComponentType.NO_RESULTS : EmptyComponentType.USER_BILLS}
          handleBillsViewChange={handleBillsViewChange}
        />
      )}
    </>
  )
}

export default React.memo(UserBillsRows)

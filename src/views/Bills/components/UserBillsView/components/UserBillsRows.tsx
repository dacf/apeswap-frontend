/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, useMatchBreakpoints } from '@ape.swap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Claim from '../../Actions/Claim'
import VestedTimer from '../../VestedTimer'
import BillModal from '../../Modals'
import ListViewContentMobile from 'components/ListViewV2/ListViewContentMobile'
import { Box } from 'theme-ui'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { BillsToRender } from '../types'
import { ExtendedListViewProps } from 'components/ListView/types'
import { formatNumberSI } from 'utils/formatNumber'
import ListView from '../../../../../components/ListViewV2'
import { LpType } from 'state/bills/types'

const UserBillsRows: React.FC<{ billsToRender: BillsToRender[] }> = ({ billsToRender }) => {
  const { isXl, isLg, isXxl } = useMatchBreakpoints()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const isMobile = !isLg && !isXl && !isXxl

  const billsListView = billsToRender?.flatMap((billToRender) => {
    if (!billToRender) return []
    const { bill } = billToRender
    const { token, quoteToken, earnToken, lpType } = bill
    const pending = getBalanceNumber(new BigNumber(billToRender.payout), bill?.earnToken?.decimals[chainId])
    const claimable = getBalanceNumber(new BigNumber(billToRender.pendingRewards), bill?.earnToken?.decimals[chainId])
    return {
      tokens: { token1: token.symbol, token2: quoteToken.symbol, token3: earnToken.symbol },
      stakeLp: true,
      id: billToRender.id,
      billArrow: true,
      title: (
        <ListViewContent
          tag={lpType === LpType.ARRAKIS ? 'ark' : 'ape'}
          value={bill.lpToken.symbol}
          style={{ maxWidth: '150px', height: '45px' }}
        />
      ),
      titleContainerWidth: 260,
      cardContent: isMobile ? (
        <ListViewContentMobile
          title={'Claimable'}
          value={formatNumberSI(parseFloat(claimable.toFixed(0)), 3)}
          value2={`($${(claimable * billToRender?.bill?.earnTokenPrice).toFixed(2)})`}
          value2Secondary
          toolTip={`This is the amount of tokens that have vested and available to claim.`}
          toolTipPlacement={'bottomLeft'}
          toolTipTransform={'translate(29%, 0%)'}
        />
      ) : (
        <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <ListViewContent
            title={t('Claimable')}
            value={formatNumberSI(parseFloat(claimable.toFixed(0)), 3)}
            value2={`($${(claimable * billToRender?.bill?.earnTokenPrice).toFixed(2)})`}
            value2Secondary
            valuesDirection="row"
            style={{ maxWidth: isMobile ? '120px' : '135px', ml: '10px', height: '52.5px' }}
            toolTip={t('This is the amount of tokens that have vested and available to claim.')}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(29%, -4%)"
          />
          <ListViewContent
            title={t('Pending')}
            value={formatNumberSI(parseFloat(pending.toFixed(0)), 3)}
            value2={`($${(pending * billToRender?.bill?.earnTokenPrice).toFixed(2)})`}
            value2Secondary
            valuesDirection="row"
            style={{ maxWidth: isMobile ? '120px' : '135px', ml: '10px', height: '52.5px' }}
            toolTip={t('This is the amount of unvested tokens that cannot be claimed yet.')}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(22%, -4%)"
          />
          <VestedTimer lastBlockTimestamp={billToRender.lastBlockTimestamp} vesting={billToRender.vesting} />
          <Flex sx={{ minWidth: '220px', alignItems: 'center' }}>
            <Claim
              billAddress={bill.contractAddress[chainId]}
              billIds={[billToRender.id]}
              buttonSize={'100px'}
              pendingRewards={billToRender?.pendingRewards}
              margin={'0 10px'}
            />
            <BillModal buttonText={t('VIEW')} bill={bill} billId={billToRender.id} buttonSize={'100px'} />
          </Flex>
        </Flex>
      ),
      expandedContentSize: 185,
      expandedContent: isMobile && (
        <Flex sx={{ width: '100%', flexWrap: 'wrap', padding: '0 10px' }}>
          <Flex sx={{ width: '100%', flexDirection: 'column' }}>
            <ListViewContentMobile
              title={'Pending'}
              value={formatNumberSI(parseFloat(pending.toFixed(0)), 3)}
              value2={`($${(pending * billToRender?.bill?.earnTokenPrice).toFixed(2)})`}
              value2Secondary
              toolTip={`This is the amount of unvested tokens that cannot be claimed yet.`}
              toolTipPlacement={'bottomLeft'}
              toolTipTransform={'translate(22%, 0%)'}
            />
            <VestedTimer
              lastBlockTimestamp={billToRender.lastBlockTimestamp}
              vesting={billToRender.vesting}
              mobileFlag
            />
          </Flex>
          <Flex sx={{ width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ width: '240px', margin: '10px 0' }}>
              <Claim
                billAddress={bill.contractAddress[chainId]}
                billIds={[billToRender.id]}
                pendingRewards={billToRender?.pendingRewards}
                margin={'0'}
              />
            </Box>
            <Box sx={{ width: '240px', mb: 6 }}>
              <BillModal buttonText={t('VIEW')} bill={bill} billId={billToRender.id} buttonSize={'240px'} />
            </Box>
          </Flex>
        </Flex>
      ),
    }
  }) as ExtendedListViewProps[]

  return <ListView listViews={billsListView} />
}

export default React.memo(UserBillsRows)

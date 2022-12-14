/** @jsxImportSource theme-ui */
import React from 'react'
import getTimePeriods from 'utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { LpTypeVariants } from 'components/ListViewV2/types'
import ProjectLinks from '../../UserBillsView/components/ProjectLinks'
import ListViewContentMobile from 'components/ListViewV2/ListViewContentMobile'
import { Flex, InfoIcon, TooltipBubble, useMatchBreakpoints } from '@ape.swap/uikit'
import BillModal from '../../Modals'
import UnlockButton from 'components/UnlockButton'
import { ExtendedListViewProps } from 'components/ListView/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import ListView from 'components/ListViewV2'
import EmptyListComponent, { EmptyComponentType } from '../../EmptyListComponent/EmptyList'
import { Bills, LpType } from 'state/bills/types'

interface BillsRowsProps {
  billsToRender: any
  noResults: boolean
}

const BillsRows: React.FC<BillsRowsProps> = ({ billsToRender, noResults }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isSmall = !isXxl
  const isMobile = !isLg && !isXl && !isXxl

  const billsListView = billsToRender.map((bill: Bills) => {
    const { earnToken, token, quoteToken, maxTotalPayOut, totalPayoutGiven, earnTokenPrice, lpType } = bill
    const vestingTime = getTimePeriods(parseInt(bill.vestingTime), true)
    const available = new BigNumber(maxTotalPayOut)
      ?.minus(new BigNumber(totalPayoutGiven))
      ?.div(new BigNumber(10).pow(earnToken.decimals[chainId]))

    const threshold = new BigNumber(11).div(earnTokenPrice)
    const disabled = new BigNumber(available).lte(threshold)

    const displayAvailable = available.toFixed(available.lte(10000000) ? 2 : 0)

    return {
      tokens: { token1: token.symbol, token2: quoteToken.symbol, token3: earnToken.symbol },
      stakeLp: true,
      id: bill.index,
      billArrow: true,
      title: (
        <ListViewContent
          tag={lpType === LpType.ARRAKIS ? LpTypeVariants.UNI : LpTypeVariants.APE}
          value={bill.lpToken.symbol}
          width={150}
          height={45}
          ml={0}
        />
      ),
      infoContent: isSmall && <ProjectLinks website={bill?.projectLink} twitter={bill?.twitter} t={t} isMobile />,
      ttWidth: isSmall && '200px',
      toolTipIconWidth: '15px',
      toolTipStyle: isSmall && { marginRight: '10px' },
      infoContentPosition: 'translate(10%, 0%)',
      titleContainerWidth: 260,
      cardContent: isMobile ? (
        <ListViewContentMobile
          title={'Discount'}
          value={disabled ? 'N/A' : `${bill?.discount}%`}
          valueColor={disabled ? null : parseFloat(bill?.discount) < 0 ? '#DF4141' : '#38A611'}
          toolTip={`This is the percentage discount relative to the token's current market price.`}
          toolTipPlacement={'bottomLeft'}
          toolTipTransform={'translate(23%, 0%)'}
        />
      ) : (
        <Flex style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
          <ListViewContent
            title={t('Price')}
            value={disabled ? 'N/A' : `$${bill?.priceUsd}`}
            width={isSmall ? 130 : 130}
            ml={isSmall ? 10 : 15}
            height={52.5}
            toolTip={t('This is the current discounted price of the tokens.')}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(11%, 0%)"
          />
          <ListViewContent
            title={t('Discount')}
            valueColor={disabled ? null : parseFloat(bill?.discount) < 0 ? '#DF4141' : '#38A611'}
            value={disabled ? 'N/A' : `${bill?.discount}%`}
            width={isSmall ? 75 : 90}
            ml={isSmall ? 10 : 15}
            height={52.5}
            toolTip={t("This is the percentage discount relative to the token's current market price.")}
            toolTipPlacement="bottomLeft"
            toolTipTransform={'translate(23%, 0%)'}
          />
          <ListViewContent
            title={t('Vesting Term')}
            value={vestingTime.days ? `${vestingTime.days} days` : 'NaN'}
            width={isSmall ? 105 : 105}
            ml={isSmall ? 10 : 15}
            height={52.5}
            toolTip={t('This is how long it will take for all tokens in the Bill to fully vest.')}
            toolTipPlacement={isSmall ? 'bottomRight' : 'bottomLeft'}
            toolTipTransform={isSmall ? 'translate(13%, 0%)' : 'translate(39%, 0%)'}
          />
          <ListViewContent
            title={t('Available Tokens')}
            value={disabled ? '0' : parseFloat(displayAvailable).toLocaleString(undefined)}
            width={isSmall ? 150 : 150}
            ml={isSmall ? 10 : 15}
            height={52.5}
            toolTip={t('This is the amount of available tokens for purchase.')}
            toolTipPlacement={isSmall ? 'bottomRight' : 'bottomLeft'}
            toolTipTransform={isSmall ? 'translate(13%, 0%)' : 'translate(49%, 0%)'}
          />
          {!isSmall && (
            <>
              <Flex style={{ height: '100%', alignItems: 'center', minWidth: '145px' }}>
                {account ? (
                  <BillModal
                    bill={bill}
                    buttonText={disabled ? t('SOLD OUT') : t('BUY')}
                    id={bill.index}
                    buyFlag
                    disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
                  />
                ) : (
                  <UnlockButton sx={{ width: '100%' }} />
                )}
              </Flex>
              <Flex sx={{ alignItems: 'center', height: '100%', marginLeft: '20px' }}>
                <TooltipBubble
                  placement="bottomRight"
                  transformTip="translate(8%, -2%)"
                  body={<ProjectLinks website={bill?.projectLink} twitter={bill?.twitter} t={t} />}
                >
                  <InfoIcon width="20px" />
                </TooltipBubble>
              </Flex>
            </>
          )}
        </Flex>
      ),
      expandedContentSize: 150,
      expandedContent: isSmall && (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          {account ? (
            <Flex sx={{ width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isMobile && (
                <Flex sx={{ flexWrap: 'wrap', padding: '0 10px 10px 10px', width: '100%' }}>
                  <ListViewContentMobile
                    title={'Price'}
                    value={disabled ? 'N/A' : `$${bill?.priceUsd}`}
                    toolTip={`This is the current discounted price of the tokens.`}
                    toolTipPlacement={'bottomLeft'}
                    toolTipTransform={'translate(10%, 0%)'}
                  />
                  <ListViewContentMobile
                    title={'Vesting Term'}
                    value={disabled ? 'N/A' : vestingTime.days ? `${vestingTime.days} days` : 'NaN'}
                    toolTip={`This is how long it will take for all tokens in the Bill to fully vest.`}
                    toolTipPlacement={'bottomLeft'}
                    toolTipTransform={'translate(39%, 0%)'}
                  />
                  <ListViewContentMobile
                    title={'Available Tokens'}
                    value={disabled ? '0' : parseFloat(displayAvailable).toLocaleString(undefined)}
                    toolTip={`This is the amount of available tokens for purchase.`}
                    toolTipPlacement={'bottomLeft'}
                    toolTipTransform={'translate(50%, 0%)'}
                  />
                </Flex>
              )}
              <Flex sx={{ width: '240px', justifyContent: 'center' }}>
                <BillModal
                  bill={bill}
                  buttonText={disabled ? t('SOLD OUT') : t('BUY')}
                  id={bill.index}
                  buyFlag
                  disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
                  buttonSize={'100%'}
                />
              </Flex>
            </Flex>
          ) : (
            <Flex sx={{ width: '240px', justifyContent: 'center' }}>
              <UnlockButton sx={{ width: '100%' }} />
            </Flex>
          )}
        </Flex>
      ),
    } as ExtendedListViewProps
  })
  return (
    <>
      {billsListView?.length ? (
        <ListView listViews={billsListView} />
      ) : (
        <EmptyListComponent type={noResults ? EmptyComponentType.NO_RESULTS : EmptyComponentType.AVAILABLE_BILLS} />
      )}
    </>
  )
}

export default React.memo(BillsRows)

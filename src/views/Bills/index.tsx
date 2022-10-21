/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import { useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { usePollBills, useBills, usePollUserBills, useSetBills } from 'state/bills/hooks'
import { Bills as BillType } from 'state/types'
import ListViewLayout from 'components/layout/ListViewLayout'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import BillsListView from './components/BillsListView'
import UserBillViews from './components/UserBillViews'
import BillMenu from './components/Menu'
import { BannerTypes } from 'components/Banner/types'
import { useSetZapOutputList } from 'state/zap/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ListView404 from 'components/ListView404'
import { AVAILABLE_CHAINS_ON_PRODUCTS } from 'config/constants/chains'

const Bills: React.FC = () => {
  useSetBills()
  usePollBills()
  usePollUserBills()
  const { chainId } = useActiveWeb3React()
  const bills = useBills()
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')
  const location = useLocation()

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const renderBills = (showNonPurchaseable: boolean): BillType[] => {
    let billsToReturn = []
    bills?.forEach((bill) => {
      if (bill.inactive && !showNonPurchaseable) return
      if (location.search.includes(`id=${bill.index}`)) {
        billsToReturn.unshift(bill)
      } else {
        billsToReturn.push(bill)
      }
    })

    if (query) {
      billsToReturn = billsToReturn?.filter((bill) => {
        return bill.lpToken.symbol.toUpperCase().includes(query.toUpperCase())
      })
    }

    if (sortOption === 'bananaBill') {
      billsToReturn = billsToReturn?.filter((bill) => bill.billType === 'BANANA Bill')
    }
    if (sortOption === 'jungleBill') {
      billsToReturn = billsToReturn?.filter((bill) => bill.billType === 'JUNGLE Bill')
    }

    return billsToReturn
  }
  // Set zap output list to match dual farms
  useSetZapOutputList(
    renderBills(false)?.map((bill) => {
      return {
        currencyIdA: bill?.token.address[chainId],
        currencyIdB: bill?.quoteToken.address[chainId],
      }
    }),
  )

  return (
    <>
      <Flex
        mb="80px"
        sx={{
          position: 'relative',
          top: '30px',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItem: 'center',
        }}
      >
        <ListViewLayout>
          <Banner
            banner={`${chainId}-treasury-bills` as BannerTypes}
            title={t('Treasury Bills')}
            link="https://apeswap.gitbook.io/apeswap-finance/product-and-features/raise/treasury-bills"
            listViewBreak
            maxWidth={1130}
            titleColor="primaryBright"
          />
          <BillMenu
            bills={bills}
            onHandleQueryChange={handleChangeQuery}
            onSetSortOption={setSortOption}
            activeOption={sortOption}
            query={query}
          />
          {!AVAILABLE_CHAINS_ON_PRODUCTS['bills'].includes(chainId) ? (
            <Flex sx={{ mt: '20px' }}>
              <ListView404 product="bills" />
            </Flex>
          ) : (
            <>
              <UserBillViews bills={renderBills(true)} />
              <BillsListView bills={renderBills(false)} />
            </>
          )}
        </ListViewLayout>
      </Flex>
    </>
  )
}

export default React.memo(Bills)

/** @jsxImportSource theme-ui */
import React, { useMemo, useState } from 'react'
import { Bills } from 'state/types'
import { Container } from '../styles'
import UserBillsRows from './components/UserBillsRows'
import UserBillsMenu from './components/UserBillsMenu'
import { useBills } from 'state/bills/hooks'
import { Flex } from '@ape.swap/uikit'
import { BillsView } from '../../index'

interface UserBillsViewProps {
  handleBillsViewChange: (view: BillsView) => void
}

const UserBillsView: React.FC<UserBillsViewProps> = ({ handleBillsViewChange }) => {
  const bills = useBills()
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('sort')
  const [filterOption, setFilterOption] = useState('filter')
  const [showClaimed, setShowClaimed] = useState(false)
  const [listView, setListView] = useState(true)
  const noResults = !!query || filterOption !== 'all' || showClaimed

  const billsToRender = useMemo((): Bills[] => {
    let billsToReturn = bills
    if (query) {
      billsToReturn = billsToReturn?.filter((bill) => {
        return bill.lpToken.symbol.toUpperCase().includes(query.toUpperCase())
      })
    }
    if (filterOption === 'bananaBill') {
      billsToReturn = billsToReturn?.filter((bill) => bill.billType.toUpperCase() === 'BANANA Bill'.toUpperCase())
    }
    if (filterOption === 'jungleBill') {
      billsToReturn = billsToReturn?.filter((bill) => bill.billType.toUpperCase() === 'JUNGLE Bill'.toUpperCase())
    }
    return billsToReturn.filter((bill) => bill?.userOwnedBillsData?.length > 0)
  }, [bills, query, filterOption])

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <Container>
      <UserBillsMenu
        bills={bills}
        onHandleQueryChange={handleChangeQuery}
        setFilterOption={setFilterOption}
        filterOption={filterOption}
        setSortOption={setSortOption}
        sortOption={sortOption}
        query={query}
        showClaimed={showClaimed}
        setShowClaimed={setShowClaimed}
        listView={listView}
        setListView={setListView}
      />
      <Flex flexDirection="column" sx={{ padding: '20px 0 50px 0', width: '100%' }}>
        <UserBillsRows
          bills={billsToRender}
          sortOption={sortOption}
          showClaimed={showClaimed}
          listView={listView}
          handleBillsViewChange={handleBillsViewChange}
          noResults={noResults}
        />
      </Flex>
    </Container>
  )
}

export default React.memo(UserBillsView)

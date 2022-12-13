/** @jsxImportSource theme-ui */
import React from 'react'
import { Container } from './styles'
import { TabNav } from 'components/TabNav'

interface BillsNavProps {
  billsView: string
  setBillsView: (newBillsView: string) => void
  ownedBillsAmount: number
}

const BillsNav: React.FC<BillsNavProps> = ({ billsView, setBillsView, ownedBillsAmount }) => {
  return (
    <Container>
      <TabNav
        tabOptions={['Available Bills', 'Your Bills']}
        activeTab={billsView}
        onChangeActiveTab={setBillsView}
        ownedBillsAmount={ownedBillsAmount ? ownedBillsAmount : 0}
      />
    </Container>
  )
}

export default React.memo(BillsNav)

/** @jsxImportSource theme-ui */
import React from 'react'
import useIsMobile from 'hooks/useIsMobile'
import MarketingSwipper from './MarketingSwipper'
import CardView from './CardView'

const QuestModal = ({ onDismiss }) => {
  const isMobile = useIsMobile()

  return isMobile ? <MarketingSwipper onDismiss={onDismiss} /> : <CardView onDismiss={onDismiss} />
}

export default React.memo(QuestModal)

/** @jsxImportSource theme-ui */
import React from 'react'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import useIsMobile from 'hooks/useIsMobile'
import ListCard from './ListCard'
import { ListViewContainer } from './styles'
import MobileListCard from './MobileListCard'
import { ListViewProps } from './types'

const ListView: React.FC<{ listViews: ListViewProps[] }> = ({ listViews }) => {
  const isMobile = useIsMobile()

  return (
    <ListViewContainer>
      {listViews.map((view) => {
        return isMobile ? (
          <MobileListCard
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                billArrow={view?.billArrow}
                earnLp={view?.earnLp}
                stakeLp={view?.stakeLp}
                dualEarn={view.tokens?.token4 != null}
                noEarnToken={view?.noEarnToken}
              />
            }
            title={view.title}
            cardContent={view.cardContent}
            expandedContent={view.expandedContent}
            infoContent={view.infoContent}
            key={view.id}
            expandedContentSize={view?.expandedContentSize}
            titleContainerWidth={view?.titleContainerWidth}
          />
        ) : (
          <ListCard
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                billArrow={view?.billArrow}
                earnLp={view?.earnLp}
                stakeLp={view?.stakeLp}
                dualEarn={view.tokens?.token4 != null}
                noEarnToken={view?.noEarnToken}
              />
            }
            title={view.title}
            cardContent={view.cardContent}
            expandedContent={view.expandedContent}
            infoContent={view.infoContent}
            key={view.id}
            expandedContentSize={view?.expandedContentSize}
            titleContainerWidth={view?.titleContainerWidth}
          />
        )
      })}
    </ListViewContainer>
  )
}

export default React.memo(ListView)

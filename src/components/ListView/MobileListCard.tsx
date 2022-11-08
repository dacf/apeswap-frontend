/** @jsxImportSource theme-ui */
import { Flex, TooltipBubble, InfoIcon } from '@ape.swap/uikit'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { ContentContainer, DropDownIcon, ListCardContainer, styles } from './styles'
import { ListCardProps } from './types'

const MobileListCard: React.FC<ListCardProps> = ({
  serviceTokenDisplay,
  tag,
  title,
  cardContent,
  expandedContent,
  infoContent,
  infoContentPosition,
  open,
  expandedContentSize,
  toolTipIconWidth,
  toolTipStyle,
  ttWidth,
  backgroundColor,
  beforeTokenContent,
  forMigratonList,
}) => {
  const [expanded, setExpanded] = useState(open)
  return (
    <>
      <ListCardContainer
        onClick={() => setExpanded((prev) => !prev)}
        backgroundColor={backgroundColor}
        forMigrationList={forMigratonList}
      >
        <Flex sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Flex>{beforeTokenContent}</Flex>
          <Flex sx={{ ...styles.titleContainer }}>
            {serviceTokenDisplay}
            <Flex sx={{ flexDirection: 'column', marginLeft: '10px' }}>
              {tag}
              {title}
            </Flex>
          </Flex>
          <Flex>
            {expandedContent && <DropDownIcon open={expanded} mr="20px" width={forMigratonList ? '10px' : '15px'} />}
            {infoContent && (
              <div style={{ display: 'inline-block', ...toolTipStyle }}>
                <TooltipBubble
                  body={infoContent}
                  transformTip={infoContentPosition || 'translate(0%, 0%)'}
                  width={ttWidth || '200px'}
                >
                  <InfoIcon width={toolTipIconWidth || '25px'} />
                </TooltipBubble>
              </div>
            )}
          </Flex>
        </Flex>
        <ContentContainer>{cardContent}</ContentContainer>
      </ListCardContainer>
      <AnimatePresence>
        {expandedContent && expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ height: 0 }}
            sx={{ position: 'relative', width: '100%', maxWidth: '500px', minWidth: '300px', overflow: 'hidden' }}
          >
            <Flex
              sx={{
                background: 'white3',
                flexDirection: 'column',
                height: expandedContentSize || '234px',
                justifyContent: 'space-between',
                padding: '15px 10px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {expandedContent}
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(MobileListCard)

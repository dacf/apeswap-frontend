/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, HelpIcon } from '@apeswapfinance/uikit'
import { LpTag, TooltipBubble } from '@ape.swap/uikit'
import { TitleContentText, ListViewContentContainer, ValueText, ValueSkeleton } from './styles'
import { ListViewContentProps } from './types'

const ListViewContent: React.FC<ListViewContentProps> = ({
  tag,
  title,
  value,
  value2,
  value2Secondary,
  valueIcon,
  value2Icon,
  mb,
  ml,
  width,
  height,
  valueColor,
  lineHeight,
  toolTip,
  aprCalculator,
  toolTipPlacement,
  toolTipTransform,
  justifyContent,
}) => {
  return (
    <ListViewContentContainer mb={mb} ml={ml} width={width} height={height}>
      <Flex alignItems="center">
        {toolTip ? (
          <Flex alignItems="flex-start">
            <div style={{ display: 'inline-block' }}>
              <TooltipBubble
                placement={toolTipPlacement || 'topLeft'}
                transformTip={toolTipTransform}
                body={<Flex>{toolTip}</Flex>}
                width="180px"
              >
                <TitleContentText lineHeight={lineHeight}>
                  {title}
                  <HelpIcon width="12px" ml="5px" />
                </TitleContentText>
              </TooltipBubble>
            </div>
            <div style={{ marginLeft: '5px' }} />
            {aprCalculator}
          </Flex>
        ) : (
          <Flex>
            <TitleContentText lineHeight={lineHeight}>{tag ? <LpTag variant={tag} /> : title}</TitleContentText>
            {aprCalculator}
          </Flex>
        )}
      </Flex>

      <Flex alignItems="center" justifyContent={justifyContent}>
        {valueIcon && valueIcon}
        <ValueText bold lineHeight={lineHeight} valueColor={valueColor}>
          {value.includes('NaN') || value.includes('undefined') || value.includes('null') ? <ValueSkeleton /> : value}
        </ValueText>
      </Flex>

      <Flex alignItems="center" justifyContent={justifyContent}>
        {value2Icon && value2Icon}
        {value2 && (
          <ValueText bold={!value2Secondary} value2Secondary={value2Secondary} lineHeight={lineHeight}>
            {value2.includes('NaN') || value2.includes('undefined') || value.includes('null') ? (
              <ValueSkeleton />
            ) : (
              value2
            )}
          </ValueText>
        )}
      </Flex>
    </ListViewContentContainer>
  )
}

export default React.memo(ListViewContent)

/** @jsxImportSource theme-ui */
import React from 'react'
import { LpTag, TooltipBubble, Flex, HelpIcon, Text, Skeleton } from '@ape.swap/uikit'
import { styles } from './styles'
import { ListViewContentProps } from './types'

const ListViewContent: React.FC<ListViewContentProps> = ({
  tag,
  title,
  value,
  value2,
  value2Secondary,
  valueIcon,
  value2Icon,
  valueColor,
  toolTip,
  aprCalculator,
  toolTipPlacement,
  toolTipTransform,
  style,
  valuesDirection = 'column',
}) => {
  return (
    <Flex sx={{ ...style, ...styles.listViewContainer }}>
      <Flex>
        {toolTip ? (
          <Flex alignItems="flex-start">
            <div style={{ display: 'inline-block' }}>
              <TooltipBubble
                placement={toolTipPlacement || 'topLeft'}
                transformTip={toolTipTransform}
                body={<Flex>{toolTip}</Flex>}
                width="180px"
              >
                <Text sx={styles.titleText}>
                  {title}
                  <HelpIcon width="12px" ml="5px" />
                </Text>
              </TooltipBubble>
            </div>
            <div style={{ marginLeft: '5px' }} />
            {aprCalculator}
          </Flex>
        ) : (
          <Flex>
            {tag ? <LpTag variant={tag} /> : <Text sx={styles.titleText}>{title}</Text>}
            {aprCalculator}
          </Flex>
        )}
      </Flex>
      <Flex sx={{ flexDirection: valuesDirection }}>
        <Flex>
          {valueIcon && valueIcon}
          <Text sx={{ ...styles.valueText, color: valueColor }}>
            {value.includes('NaN') || value.includes('undefined') || value.includes('null') ? (
              <Skeleton sx={styles.skeleton} />
            ) : (
              value
            )}
          </Text>
        </Flex>
        <Flex sx={{ ml: valuesDirection === 'row' ? '5px' : 0 }}>
          {value2Icon && value2Icon}
          {value2 && (
            <Text sx={value2Secondary ? styles.secondaryText : styles.valueText}>
              {value2.includes('NaN') || value2.includes('undefined') || value.includes('null') ? (
                <Skeleton sx={styles.skeleton} />
              ) : (
                value2
              )}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(ListViewContent)

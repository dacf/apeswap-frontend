/** @jsxImportSource theme-ui */
import React from 'react'
import { TooltipBubble, Flex, HelpIcon, Text, Skeleton } from '@ape.swap/uikit'
import { styles } from 'components/ListViewV2/styles'
import { useTranslation } from 'contexts/Localization'

interface DiscountContentProps {
  title: string
  value: string
  value2: string
  valueColor: string
  toolTip: string
  showToolTipPrice: boolean
}

const DiscountContent: React.FC<DiscountContentProps> = ({
  title,
  value,
  value2,
  valueColor,
  toolTip,
  showToolTipPrice,
}) => {
  const { t } = useTranslation()
  return (
    <Flex sx={{ maxWidth: '130px', ml: '10px', ...styles.listViewContainer }}>
      <Flex>
        <Flex alignItems="flex-start">
          <div style={{ display: 'inline-block' }}>
            <TooltipBubble
              placement="bottomLeft"
              transformTip="translate(23%, 0%)"
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
        </Flex>
      </Flex>
      <Flex sx={{ flexDirection: 'row' }}>
        <Flex>
          <Text sx={{ ...styles.valueText, color: valueColor }}>
            {value.includes('NaN') || value.includes('undefined') || value.includes('null') ? (
              <Skeleton sx={styles.skeleton} />
            ) : (
              value
            )}
          </Text>
        </Flex>
        <Flex sx={{ ml: '5px' }}>
          {value2 && (
            <Text sx={styles.secondaryText}>
              {value2.includes('NaN') || value2.includes('undefined') || value.includes('null') ? (
                <Skeleton sx={styles.skeleton} />
              ) : showToolTipPrice ? (
                <TooltipBubble
                  placement="bottomLeft"
                  transformTip="translate(5%, 0%)"
                  body={
                    <Flex>
                      {t('Price: $')}
                      {value2}
                    </Flex>
                  }
                  width="180px"
                >
                  ($0.000...)
                </TooltipBubble>
              ) : (
                ` ($${value2})`
              )}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(DiscountContent)

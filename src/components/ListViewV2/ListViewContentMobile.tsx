/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, HelpIcon, Text } from '@ape.swap/uikit'
import { TooltipBubble } from '@ape.swap/uikit'
import { TitleText, ValueSkeleton } from '../ListViewContent/styles'
import { useTranslation } from '../../contexts/Localization'

interface ListViewContentMobileProps {
  title: string
  value: string
  valueColor?: string
  toolTip?: string
  toolTipPlacement?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
  toolTipTransform?: string
}

const ListViewContentMobile: React.FC<ListViewContentMobileProps> = ({
  title,
  value,
  valueColor,
  toolTip,
  toolTipPlacement,
  toolTipTransform,
}) => {
  const { t } = useTranslation()
  return (
    <Flex style={{ width: '100%', justifyContent: 'space-between' }}>
      <TooltipBubble
        placement={toolTipPlacement}
        transformTip={toolTipTransform}
        body={<Flex>{t(`${toolTip}`)}</Flex>}
        width="180px"
      >
        <TitleText lineHeight={null} sx={{ display: 'flex' }}>
          {t(`${title}`)}
          <HelpIcon width="12px" ml="5px" />
        </TitleText>
      </TooltipBubble>
      <Text sx={{ color: valueColor }} weight={700} size="12px">
        {value.includes('NaN') || value.includes('undefined') || value.includes('null') ? <ValueSkeleton /> : value}
      </Text>
    </Flex>
  )
}

export default React.memo(ListViewContentMobile)

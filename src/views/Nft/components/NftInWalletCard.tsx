import React from 'react'
import { Card, Heading, Text } from '@apeswapfinance/uikit'
import useI18n from 'hooks/useI18n'
import CardContent from './CardContent'

const NftInWalletCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <div>
        <CardContent imgSrc="/images/present.svg">
          <Heading mb="8px">{TranslateString(999, 'NFT in wallet')}</Heading>
          <Text>{TranslateString(999, 'Trade in your NFT for BANANA, or just keep it for your collection.')}</Text>
        </CardContent>
      </div>
    </Card>
  )
}

export default NftInWalletCard

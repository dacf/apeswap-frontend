/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import React from 'react'
import { Image } from 'theme-ui'

export const SlideTemplate = ({
  image,
  title,
  description,
  action,
  extraInformation,
}: {
  image: string
  title: string
  description: string
  action: React.ReactNode
  extraInformation: React.ReactNode
}) => {
  return (
    <Flex key={title} sx={{ width: '250px', flexDirection: 'column', alignItems: 'center' }}>
      <Image src={image} sx={{ borderRadius: '10px' }} margin="10px 0px" width="200px" />
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', width: '230px', height: '100px' }}>
        <Text size="18px" weight={700} mt="5px">
          {title}
        </Text>
        <Text size="14px" weight={500} margin="10px 0px" sx={{ textAlign: 'center', lineHeight: '20px' }}>
          {description}
        </Text>
      </Flex>
      {action}
      {extraInformation}
    </Flex>
  )
}

/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide4 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading as="h5" color="yellow" style={{ fontSize: '12px' }}>
          {t('Ready, steady, go').toUpperCase()}
        </Heading>
        <Heading sx={{ fontSize: '21px' }}>{t('Congratulations!')}</Heading>
      </Box>
      <Box sx={{ marginTop: '10px' }}>
        <Text size="14px">{t('You are officialy ready to begin your')}</Text>{' '}
        <Text color="yellow" size="14px">
          <a
            href="https://box.genki.io/RJ4LP3"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('DeFi journey')}
          </a>
        </Text>{' '}
        <Text size="14px">{t('with ApeSwap. Good luck!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide4

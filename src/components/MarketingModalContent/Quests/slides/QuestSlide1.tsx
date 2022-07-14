/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide1 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading as="h5" color="yellow" style={{ fontSize: '12px' }}>
          {t("Let's get started").toUpperCase()}
        </Heading>
        <Heading sx={{ fontSize: '21px' }}>{t('Hello, Crypto Adventurer.')}</Heading>
      </Box>
      <Box sx={{ marginTop: '10px' }}>
        <Text size="14px">{t('Complete the')}</Text>{' '}
        <Text color="yellow" size="14px">
          <a
            href="https://box.genki.io/RJ4LP3"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('introductory Quests')}
          </a>
        </Text>{' '}
        <Text size="14px">{t('to earn great rewards while you learn!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide1

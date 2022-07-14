/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide3 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading as="h5" color="yellow" style={{ fontSize: '12px' }}>
          {t('Get it done').toUpperCase()}
        </Heading>
        <Heading sx={{ fontSize: '21px' }}>{t('Can You Complete Them All?')}</Heading>
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
            {t('Quests')}
          </a>
        </Text>{' '}
        <Text size="14px">{t('- the more you complete, the more chances you get!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide3

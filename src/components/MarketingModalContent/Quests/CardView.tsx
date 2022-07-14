/** @jsxImportSource theme-ui */
import React, { useContext, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { Button, Heading, IconButton, Modal, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ThemeContext } from 'contexts/ThemeContext'
import { Bubble, showApe, styles } from './styles'
import { QuestSlides } from './slides/index'

const CardView = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { isDark } = useContext(ThemeContext)
  const [activeSlide, setActiveSlide] = useState(0)

  const slideNav = (index: number) => {
    setActiveSlide(index)
  }

  const handleNext = () => {
    if (QuestSlides.length <= activeSlide + 1) {
      onDismiss()
    } else {
      setActiveSlide(activeSlide + 1)
    }
  }

  return (
    <Modal onDismiss={onDismiss}>
      <Flex sx={styles.container}>
        <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>
          <IconButton width="15px" icon="close" color="text" variant="transparent" onClick={onDismiss} />
        </Box>
        <Flex sx={styles.imagesWrapper}>
          <Box sx={showApe(activeSlide, isDark)} />
        </Flex>
        <Flex sx={styles.textWrapper}>
          <Box sx={{ width: '100%' }}>
            <Heading>{t('Welcome to ApeSwap').toUpperCase()}</Heading>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Text color="textDisabled" size="12px">
              {t('Your DeFi Journey Starts Here!')}
            </Text>
          </Box>
          {QuestSlides[activeSlide]}
          <Flex sx={styles.bubbleWrapper}>
            {[...Array(QuestSlides.length)].map((_, i) => {
              return <Bubble isActive={i === activeSlide} onClick={() => slideNav(i)} style={{ marginRight: '10px' }} />
            })}
          </Flex>
          <Flex sx={{ width: '240px', marginTop: '10px' }}>
            <Button fullWidth onClick={handleNext}>
              {activeSlide + 1 === QuestSlides.length ? t("I'm ready") : t('Next')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default React.memo(CardView)

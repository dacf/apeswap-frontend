/** @jsxImportSource theme-ui */
import React, { useContext, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import 'swiper/swiper.min.css'
import { Box, Flex } from 'theme-ui'
import useSwiper from 'hooks/useSwiper'
import useIsMobile from 'hooks/useIsMobile'
import { Button, Heading, IconButton, Modal, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ThemeContext } from 'contexts/ThemeContext'
import { Bubble, showApe, styles } from './styles'
import { QuestSlides } from './slides/index'

const MarketingSwipper = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { isDark } = useContext(ThemeContext)
  const { swiper, setSwiper } = useSwiper()
  const [activeSlide, setActiveSlide] = useState(0)
  const isMobile = useIsMobile()

  const slideNav = (index: number) => {
    setActiveSlide(index)
    swiper.slideTo(index)
  }

  const handleSlide = (event: SwiperCore) => {
    setActiveSlide(event.activeIndex)
  }

  const handleNext = () => {
    if (QuestSlides.length <= activeSlide + 1) {
      onDismiss()
    } else {
      slideNav(activeSlide + 1)
    }
  }

  return isMobile ? (
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
          <Swiper
            id="marketingSwapper"
            onSwiper={setSwiper}
            spaceBetween={20}
            centeredSlides
            resizeObserver
            lazy
            preloadImages={false}
            onSlideChange={handleSlide}
          >
            {QuestSlides.map((slide) => {
              return <SwiperSlide>{slide}</SwiperSlide>
            })}
          </Swiper>
          <Flex sx={styles.bubbleWrapper}>
            {[...Array(QuestSlides.length)].map((_, i) => {
              return <Bubble isActive={i === activeSlide} onClick={() => slideNav(i)} style={{ marginRight: '10px' }} />
            })}
          </Flex>
          <Flex sx={{ width: '240px', marginBottom: '20px' }}>
            <Button fullWidth onClick={handleNext}>
              {activeSlide + 1 === QuestSlides.length ? t("I'm ready") : t('Next')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  ) : null
}

export default React.memo(MarketingSwipper)

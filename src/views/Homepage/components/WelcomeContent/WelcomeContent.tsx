/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Flex } from '@ape.swap/uikit'
import { styles } from './styles'
import BackgroundCircles from './BackgroundCircles'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import useSwiper from 'hooks/useSwiper'
import SwiperCore from 'swiper'
import { getDotPos } from 'utils/getDotPos'
import ApeSwapV3 from './slides/ApeSwapV3'
import { Bubble } from '../News/styles'
import DefiRedefined from './slides/DefiRedefined'

const slides = [<DefiRedefined key={0} />, <ApeSwapV3 key={1} />]

const WelcomeContent: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const { swiper, setSwiper } = useSwiper()

  const handleSlide = (event: SwiperCore) => {
    const slideNumber = getDotPos(event.activeIndex, 2)
    setActiveSlide(slideNumber)
  }

  const slideTo = (index: number) => {
    setActiveSlide(index)
    swiper.slideTo(slides.length + index)
  }

  return (
    <Flex sx={styles.mainContainer}>
      <Flex sx={styles.yellowShadow} />
      <Flex sx={styles.centeredContainer}>
        <Flex sx={styles.slideContainer}>
          {slides.length > 1 ? (
            <Flex sx={{ flexDirection: 'column' }}>
              <Swiper
                id="homeSwiper"
                autoplay={{
                  delay: 100000,
                  disableOnInteraction: false,
                }}
                loop
                onSwiper={setSwiper}
                slidesPerView="auto"
                centeredSlides
                lazy
                preloadImages={false}
                onSlideChange={handleSlide}
                style={{ width: '100%' }}
              >
                {slides.map((slide, index) => {
                  return (
                    <SwiperSlide
                      style={{
                        width: '100%',
                        padding: '1px',
                        height: 'fit-content',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      key={index}
                    >
                      {slide}
                    </SwiperSlide>
                  )
                })}
              </Swiper>
              <Flex sx={styles.bubbleContainer}>
                {[...Array(slides.length)].map((_, i) => {
                  return <Bubble isActive={i === activeSlide} onClick={() => slideTo(i)} key={i} />
                })}
              </Flex>
            </Flex>
          ) : (
            slides[0]
          )}
        </Flex>
        <Flex sx={styles.circlesContainer}>
          <BackgroundCircles />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default WelcomeContent

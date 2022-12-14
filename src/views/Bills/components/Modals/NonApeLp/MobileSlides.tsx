/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React, { useState } from 'react'
import 'swiper/swiper.min.css'
import useSwiper from 'hooks/useSwiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Bubble } from 'views/Homepage/components/Values/styles'

export const MobileSlides = ({ slides }: { slides: React.ReactNode[] }) => {
  const { swiper, setSwiper } = useSwiper()
  const [activeSlide, setActiveSlide] = useState(0)

  const slideVal = (index: number) => {
    setActiveSlide(index)
    swiper.slideTo(index)
  }

  const handleSlide = (event: SwiperCore) => {
    setActiveSlide(event.activeIndex)
  }
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Swiper
        id="serviceSwiper"
        initialSlide={0}
        spaceBetween={20}
        slidesPerView="auto"
        loopedSlides={slides.length}
        loop={false}
        onSwiper={setSwiper}
        onSlideChange={handleSlide}
        centeredSlides
        resizeObserver
        lazy
        style={{ height: 'fit-content', width: '100%' }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            key={`swiper-slide-${i}`}
          >
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex
        sx={{
          width: '100%',
          mt: '25px',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {[...Array(slides.length)].map((_, i) => {
          return <Bubble isActive={i === activeSlide} onClick={() => slideVal(i)} key={i} />
        })}
      </Flex>
    </Flex>
  )
}

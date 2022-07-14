/** @jsxImportSource theme-ui */
import styled from 'styled-components'
import { ThemeUIStyleObject } from 'theme-ui'

export const Bubble = styled.div<{ isActive?: boolean }>`
  background: ${({ isActive, theme }) =>
    isActive ? 'linear-gradient(53.53deg, #a16552 15.88%, #e1b242 92.56%)' : theme.colors.white4};
  height: 14px;
  width: 14px;
  border-radius: 50px;
  margin: 0px 2.5px 0px 2.5px;
  cursor: pointer;
`
export const showApe = (slide, isDark): ThemeUIStyleObject => ({
  width: '100%',
  height: '250px',
  '@media screen and (min-width: 853px)': {
    height: '460px',
  },
  background: `url(images/marketing-modals/questApe-${isDark ? 'dark-' : 'light-'}${slide}.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
})

export const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    marginTop: '20px',
    alignItems: 'flex-start',
    overflow: 'hidden',
    overflowY: 'auto',
    height: '570px',
    '@media screen and (min-width: 853px)': {
      width: '100%',
      minWidth: '640px',
      maxWidth: '800px',
      height: '460px',
    },
    flexWrap: 'wrap',
  },
  imagesWrapper: {
    width: '100%',
    '@media screen and (min-width: 853px)': {
      width: '45%',
    },
    justifyContent: 'center',
  },
  textWrapper: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    '@media screen and (min-width: 853px)': {
      padding: '85px 0 0 30px',
      width: '55%',
      textAlign: 'start',
      justifyContent: 'flex-start',
    },
    flexWrap: 'wrap',
  },
  bubbleWrapper: {
    width: '100%',
    margin: '10px 0',
    justifyContent: 'center',
    '@media screen and (min-width: 853px)': {
      justifyContent: 'flex-start',
    },
  },
  text: {
    width: '100%',
    marginTop: '15px',
  },
}

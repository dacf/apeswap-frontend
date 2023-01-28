import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  desktopStepContainer: {
    height: '100px',
    width: '100%',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    '@media screen and (min-width: 600px) and (max-width: 1075px)': {
      padding: '2.5px',
    },
  },
  desktopProgressCircleContainer: {
    height: '60px',
    minWidth: '60px',
    borderRadius: '30px',
    background: 'white3',
    alignItems: 'center',
    justifyContent: 'center',
    mr: '15px',
    ml: '5px',
    '@media screen and (min-width: 600px) and (max-width: 1075px)': {
      mr: '5px',
      minWidth: '45px',
      maxWidth: '45px',
      height: '45px',
    },
  },
  desktopStepLineIndicator: {
    background: 'gradient',
    height: '50px',
    width: '5px',
    position: 'absolute',
    zindex: -1,
  },
  desktopChildContainer: {
    width: '100%',
    height: 'fit-content',
    padding: '5px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    background: 'gradient',
    borderRadius: '10px',
    mt: '50px',
  },
  migrateText: {
    lineHeight: '2.5px',
    width: '100%',
    height: '0px',
    textAlign: 'center',
    opacity: '.6',
  },
  mobileProgressCircleContainer: {
    width: '30px',
    borderRadius: '15px',
    background: 'gradient',
    height: '30px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileChildContainer: {
    width: '100%',
    height: 'fit-content',
    padding: '5px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    background: 'gradient',
    borderRadius: '10px',
    mt: '35px',
  },
  mobileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    zIndex: 2,
  },
}
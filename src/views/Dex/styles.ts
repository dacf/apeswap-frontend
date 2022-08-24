import { ThemeUIStyleObject } from 'theme-ui'

let isIframe = false

try {
  isIframe = window.self !== window.top
} catch (e) {
  console.error(e)
}

export const buttonHover = {
  '&:not([disabled])': { borderColor: '#FFDA00', background: '#FFDA00' },
  '&:disabled': {},
}

export const textUnderlineHover: Record<string, ThemeUIStyleObject> = {
  '::after': {
    content: "''",
    position: 'absolute',
    background: 'text',
    left: '0px',
    bottom: '0px',
    height: '2px',
    width: '100%',
    borderRadius: '10px',
    transform: 'scaleX(0)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.25s ease-out',
    backfaceVisibility: 'hidden',
  },
  ':hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
}

export const dexStyles: Record<string, ThemeUIStyleObject> = {
  pageContainer: {
    justifyContent: 'center',
    height: 'fit-content',
    minHeight: isIframe ? 'auto' : '100vh',
    padding: isIframe ? '0px' : '75px 0px',
  },
  dexContainer: {
    width: 'fit-content',
    maxWidth: '420px',
    height: 'fit-content',
    background: 'white2',
    padding: '15px',
    borderRadius: '10px',
    margin: '0px 10px',
    flexDirection: 'column',
  },
  textWrap: {
    wordBreak: 'break-all',
    lineHeight: '15px',
  },
}

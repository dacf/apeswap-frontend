import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  gnanaPanelContainer: {
    position: 'relative',
    width: '100%',
    height: '94px',
    background: 'white3',
    padding: '10px',
    borderRadius: '10px',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  panelTopContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
  },
  panelText: {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translate(0px, -30px)',
    fontWeight: 700,
  },
  primaryFlex: {
    minWidth: 'max-content',
    height: '40px',
    background: 'white4',
    padding: '5px 10px',
    borderRadius: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .3s linear',
  },
  // Token selected text
  tokenText: {
    fontSize: '14px',
    fontWeight: 700,
    margin: '0px 7.5px',
    textTransform: 'uppercase',
  },
  maxBtn: {
    height: '22px',
    padding: '0px 8px',
    fontSize: '12px',
    fontWeight: '600',
    ml: '10px',
    transition: 'all .3s linear',
    '&:active': {
      transform: 'scale(0.9)',
    },
    '&&&': {
      borderRadius: '6px',
    },
  },
  panelBottomText: {
    opacity: 0.8,
  },
}

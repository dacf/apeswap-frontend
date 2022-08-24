import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { ApeSwapTheme } from '@apeswapfinance/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends ApeSwapTheme {}
}
let isIframe = false

try {
  isIframe = window.self !== window.top
} catch (e) {
  console.error(e)
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    width: ${isIframe ? 'fit-content' : 'auto'};
    height: ${isIframe ? 'fit-content' : 'auto'};
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle

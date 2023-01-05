import React, { createContext, useCallback, useEffect } from 'react'
import { ConnectorNames, ModalProvider } from '@ape.swap/uikit'
import { ModalProvider as OldModalProvider } from '@apeswapfinance/uikit'
import { Web3ReactProvider, createWeb3ReactRoot, useWeb3React } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import NftProvider from 'views/Nft/contexts/NftProvider'
import { NetworkContextName } from 'config/constants'
import { LanguageProvider } from './contexts/Localization'
import Blocklist from 'components/Blocklist'
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'

export type ConnectorsContextValue = {
  ledgerlive: LedgerHQFrameConnector
}

export const useEagerConnector = (connectors: ConnectorsContextValue): void => {
  const { active, activate } = useWeb3React()

  const getEagerConnector = useCallback(async (): Promise<AbstractConnector | null> => {
    const { ledgerlive } = connectors
    console.log('asd')
    console.log(ledgerlive?.isLedgerApp())
    // Ledger Live iframe
    if (ledgerlive?.isLedgerApp()) {
      console.log('is aliveeeeeeee')
      return ledgerlive
    }

    return null
  }, [connectors])

  useEffect(() => {
    console.log(active)
    if (active) return
    ;(async () => {
      const connector = await getEagerConnector()
      if (!connector) return

      try {
        await activate(connector, undefined, true)
      } catch (error) {
        console.log('asdasd')
        console.log(error)
      }
    })()
  }, [activate, getEagerConnector, active])
}

export const useAutoConnect = (connectors: ConnectorsContextValue): void => {
  useEagerConnector(connectors)
}

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
export const ConnectorsContext = createContext({} as ConnectorsContextValue)
const connectors = { ledgerlive: new LedgerHQFrameConnector() }
const AutoConnect = (props: { connectors: ConnectorsContextValue }) => {
  console.log('asd')
  useAutoConnect(props.connectors)
  return null
}

const queryClient = new QueryClient()

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ConnectorsContext.Provider value={connectors}>
          <Provider store={store}>
            <BlockNumberProvider>
              <HelmetProvider>
                <ThemeContextProvider>
                  <NftProvider>
                    <LanguageProvider>
                      <Blocklist>
                        <RefreshContextProvider>
                          <ModalProvider>
                            <OldModalProvider>
                              <QueryClientProvider client={queryClient}>
                                <AutoConnect connectors={connectors} />
                                {children}
                              </QueryClientProvider>
                            </OldModalProvider>
                          </ModalProvider>
                        </RefreshContextProvider>
                      </Blocklist>
                    </LanguageProvider>
                  </NftProvider>
                </ThemeContextProvider>
              </HelmetProvider>
            </BlockNumberProvider>
          </Provider>
        </ConnectorsContext.Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers

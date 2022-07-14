/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { Currency, Token } from '@apeswapfinance/sdk'
import styled from '@emotion/styled'
import { Flex, Text } from '@ape.swap/uikit'
import { ModalProps, ModalFooter, Modal } from '@apeswapfinance/uikit'
import { TokenList } from '@uniswap/token-lists'
import { useTranslation } from 'contexts/Localization'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import ImportList from './ImportList'
import { CurrencyModalView } from './types'

interface CurrencySearchModalProps extends ModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
}

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;
  overflow-y: scroll;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: none;
    overflow-y: auto;
  }
`

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss()
      onCurrencySelect(currency)
    },
    [onDismiss, onCurrencySelect],
  )
  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()
  const { t } = useTranslation()

  return (
    <Modal onDismiss={onDismiss} title={t('Tokens')}>
      <ScrollableContainer>
        <Flex sx={{ flexDirection: 'column', width: '380px', maxWidth: '100%' }}>
          {modalView === CurrencyModalView.search ? (
            <CurrencySearch
              onCurrencySelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
              otherSelectedCurrency={otherSelectedCurrency}
              showCommonBases={showCommonBases}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
            />
          ) : modalView === CurrencyModalView.importToken && importToken ? (
            <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
          ) : modalView === CurrencyModalView.importList && importList && listURL ? (
            <ImportList list={importList} listURL={listURL} onImport={() => setModalView(CurrencyModalView.manage)} />
          ) : modalView === CurrencyModalView.manage ? (
            <Manage
              setModalView={setModalView}
              setImportToken={setImportToken}
              setImportList={setImportList}
              setListUrl={setListUrl}
            />
          ) : (
            ''
          )}
          {modalView === CurrencyModalView.search && (
            <ModalFooter onDismiss={onDismiss}>
              <Text
                onClick={() => setModalView(CurrencyModalView.manage)}
                className="list-token-manage-button"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('Manage Tokens')}
              </Text>
            </ModalFooter>
          )}
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

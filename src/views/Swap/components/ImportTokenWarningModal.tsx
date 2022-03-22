import React from 'react'
import { Token } from '@apeswapfinance/sdk'
import { Modal, ModalProps } from '@apeswapfinance/uikit'
import ImportToken from 'components/SearchModal/ImportToken'

interface Props extends ModalProps {
  tokens: Token[]
  onCancel: () => void
}

const ImportTokenWarningModal: React.FC<Props> = ({ tokens, handleClose, onCancel }) => {
  return (
    //  title="Import Token"

    <Modal
      handleClose={() => {
        if (handleClose) {
          handleClose()
        }
        onCancel()
      }}
    >
      <ImportToken tokens={tokens} handleCurrencySelect={handleClose} />
    </Modal>
  )
}

export default ImportTokenWarningModal

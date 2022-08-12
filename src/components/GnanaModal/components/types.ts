import { Currency } from '@apeswapfinance/sdk'
import { Field } from 'state/swap/actions'

export interface InputPanelProps {
  value: string
  currency: Currency
  panelText: string
  disabled?: boolean
  onUserInput: (value: string) => void
  handleMaxInput?: (field: any) => void
  fieldType?: Field
  fullBalance?: string
}

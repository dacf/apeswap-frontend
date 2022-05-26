import billsABI from 'config/abi/bill.json'
import { TokenPrices } from 'state/types'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import { BillsConfig } from 'config/constants/types'
import fetchBillsCalls from './fetchBillsCalls'
import cleanBillsData from './cleanBillsData'

const fetchBills = async (billsConfig: BillsConfig[], chainId: number, tokenPrices: TokenPrices[]) => {
  const billIds = []
  const billCalls = billsConfig.flatMap((bill) => {
    billIds.push(bill.index)
    return fetchBillsCalls(bill, chainId)
  })
  const vals = await multicall(chainId, billsABI, billCalls)
  const chunkSize = vals.length / billsConfig.length
  const chunkedBills = chunk(vals, chunkSize)
  return cleanBillsData(billsConfig, billIds, chunkedBills, tokenPrices, chainId)
}

export default fetchBills

import axios from 'axios'
import { baseYieldApi } from 'hooks/api'
import { BillsConfig } from 'config/constants/types'

const fetchBillsConfigFromApi = async () => {
  try {
    const fetchBills = await axios.get<BillsConfig[]>(`${baseYieldApi}/bills.json`)
    return fetchBills.data
  } catch (error) {
    console.warn('fetchDualFarmsFromApiError::', error)
    return null
  }
}

export default fetchBillsConfigFromApi

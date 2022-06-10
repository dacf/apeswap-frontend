import axios from 'axios'
import { BillsConfig } from 'config/constants/types'
import { YIELDS_BASE_URL } from 'hooks/api'

// const { REACT_APP_YIELDS_BASE_URL } = process.env

const fetchBillsConfigFromApi = async () => {
  try {
    const fetchBills = await axios.get<BillsConfig[]>(`${YIELDS_BASE_URL}/bills.json`)
    return fetchBills.data
  } catch (error) {
    console.warn('fetchDualFarmsFromApiError::', error)
    return null
  }
}

export default fetchBillsConfigFromApi

import axios from 'axios'
import { DualFarmConfig } from 'config/constants/types'

const { REACT_APP_YIELDS_BASE_URL } = process.env

const fetchFarmConfigFromApi = async () => {
  try {
    const fetchFarms = await axios.get<DualFarmConfig[]>(`${REACT_APP_YIELDS_BASE_URL}/dualFarms.json`)
    return fetchFarms.data
  } catch (error) {
    console.warn('fetchDualFarmsFromApiError::', error)
    return null
  }
}

export default fetchFarmConfigFromApi

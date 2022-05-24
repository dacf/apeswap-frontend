import axios from 'axios'
import { baseYieldApi } from 'hooks/api'
import { DualFarmConfig } from 'config/constants/types'

const fetchFarmConfigFromApi = async () => {
  try {
    const fetchFarms = await axios.get<DualFarmConfig[]>(`${baseYieldApi}/dualFarms.json`)
    console.log('fetchFarms:::', fetchFarms.data)
    return fetchFarms.data
  } catch (error) {
    console.warn('fetchIfoStatusFromApiError::', error)
    return null
  }
}

export default fetchFarmConfigFromApi

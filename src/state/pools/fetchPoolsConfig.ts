import axios from 'axios'
import { PoolConfig } from 'config/constants/types'

const { REACT_APP_YIELDS_BASE_URL } = process.env
console.log('REACT_APP_YIELDS_BASE_URL:::', REACT_APP_YIELDS_BASE_URL)

const fetchPoolsConfigFromApi = async () => {
  try {
    const fetchPools = await axios.get<PoolConfig[]>(`${REACT_APP_YIELDS_BASE_URL}/pools.json`)
    return fetchPools.data
  } catch (error) {
    console.warn('fetchPoolsFromApiError::', error)
    return null
  }
}

export default fetchPoolsConfigFromApi

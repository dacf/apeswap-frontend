import axios from 'axios'
import { PoolConfig } from 'config/constants/types'
import { YIELDS_BASE_URL } from 'hooks/api'

// const { REACT_APP_YIELDS_BASE_URL } = process.env

const fetchPoolsConfigFromApi = async () => {
  try {
    const fetchPools = await axios.get<PoolConfig[]>(`${YIELDS_BASE_URL}/pools.json`)
    return fetchPools.data
  } catch (error) {
    console.warn('fetchPoolsFromApiError::', error)
    return null
  }
}

export default fetchPoolsConfigFromApi

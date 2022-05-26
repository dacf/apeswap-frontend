import axios from 'axios'
import { baseYieldApi } from 'hooks/api'
import { PoolConfig } from 'config/constants/types'

const fetchPoolsConfigFromApi = async () => {
  try {
    const fetchPools = await axios.get<PoolConfig[]>(`${baseYieldApi}/pools2.json`)
    console.log('fetchPools:::', fetchPools.data)
    return fetchPools.data
  } catch (error) {
    console.warn('fetchPoolsFromApiError::', error)
    return null
  }
}

export default fetchPoolsConfigFromApi

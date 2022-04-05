import axiosRetry from 'axios-retry'
import axios from 'axios'
import { apiBaseUrl } from 'hooks/api'
import { HomepageData } from 'state/types'

const getHomepageStats = async (): Promise<HomepageData> => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const statRes = await axios.get(`${apiBaseUrl}/stats/tvl`)
    if (statRes.status === 500) return null
    return statRes.data
  } catch (error) {
    return null
  }
}

export default getHomepageStats

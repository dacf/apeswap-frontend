import axiosRetry from 'axios-retry'
import axios from 'axios'
import { apiBaseUrl } from 'hooks/api'
import { HomepageTokenStats } from 'state/types'

const getHomepageTokenStats = async (category: string): Promise<HomepageTokenStats[]> => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const tokenRes = await axios.get(`${apiBaseUrl}/tokens/${category}`)
    if (tokenRes.status === 500) return null
    return tokenRes.data
  } catch (error) {
    return null
  }
}

export default getHomepageTokenStats

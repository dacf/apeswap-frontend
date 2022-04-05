import axiosRetry from 'axios-retry'
import axios from 'axios'
import { ServiceData } from 'state/types'
import { apiBaseUrl } from 'hooks/api'

const getHomepageServiceStats = async (): Promise<ServiceData[]> => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const serviceResp = await axios.get(`${apiBaseUrl}/stats/features`)
    if (serviceResp.status === 500) return null
    return serviceResp.data
  } catch (error) {
    return null
  }
}

export default getHomepageServiceStats

import { apiBaseUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

const getFarmLpAprs = async (chainId: number) => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const farmLpAprs = await axios.get(`${apiBaseUrl}/stats/network/lpAprs/${chainId}`)
    if (farmLpAprs.status === 500) return null
    return farmLpAprs.data
  } catch (error) {
    return null
  }
}

export default getFarmLpAprs

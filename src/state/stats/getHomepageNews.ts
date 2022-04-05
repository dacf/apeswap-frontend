import axiosRetry from 'axios-retry'
import axios from 'axios'
import { baseUrlStrapi } from 'hooks/api'
import { NewsCardType } from 'state/types'

const getHomepageNews = async (): Promise<NewsCardType[]> => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const newsRes = await axios.get(`${baseUrlStrapi}/home-v-2-marketing-cards`)
    if (newsRes.status === 500) return null
    return newsRes.data
  } catch (error) {
    return null
  }
}

export default getHomepageNews

import axiosRetry from 'axios-retry'
import axios from 'axios'
import { baseUrlStrapi } from 'hooks/api'
import { LaunchCalendarCard } from 'state/types'

const getHomepageLaunchCalendar = async (): Promise<LaunchCalendarCard[]> => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const launchRes = await axios.get(`${baseUrlStrapi}/home-v-2-launch-calendars?_sort=launchTime:asc`)
    if (launchRes.status === 500) return null
    return launchRes.data
  } catch (error) {
    return null
  }
}

export default getHomepageLaunchCalendar

import axios from 'axios'
import { baseYieldApi } from 'hooks/api'
import { JungleFarmConfig } from 'config/constants/types'

const fetchJungleFarmConfigFromApi = async () => {
  try {
    const fetchJungleFarms = await axios.get<JungleFarmConfig[]>(`${baseYieldApi}/jungleFarms.json`)
    return fetchJungleFarms.data
  } catch (error) {
    console.warn('fetchJungleFarmsFromApiError::', error)
    return null
  }
}

export default fetchJungleFarmConfigFromApi

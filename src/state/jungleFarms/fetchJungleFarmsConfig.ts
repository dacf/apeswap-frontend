import axios from 'axios'
import { JungleFarmConfig } from 'config/constants/types'

const { REACT_APP_YIELDS_BASE_URL } = process.env

const fetchJungleFarmConfigFromApi = async () => {
  try {
    const fetchJungleFarms = await axios.get<JungleFarmConfig[]>(`${REACT_APP_YIELDS_BASE_URL}/jungleFarms.json`)
    return fetchJungleFarms.data
  } catch (error) {
    console.warn('fetchJungleFarmsFromApiError::', error)
    return null
  }
}

export default fetchJungleFarmConfigFromApi

import { useState, useEffect } from 'react'

/**
 * Returns current time in ms
 * @param refresh determines whether the hook will update the time every second or not
 */

export const useCurrentTime = (refresh = true) => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime())

  useEffect(() => {
    if (refresh) {
      const tick = () => {
        setCurrentMillis((prevMillis) => prevMillis + 1000)
      }

      const timerID = setInterval(() => tick(), 1000)

      return () => clearInterval(timerID)
    }
  }, [refresh])

  return currentMillis
}

export default useCurrentTime

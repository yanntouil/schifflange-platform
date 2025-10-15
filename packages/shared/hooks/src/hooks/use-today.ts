import React from "react"

/**
 * useToday
 * returns the current date updated every new day
 */
export const useToday = () => {
  const [today, setToday] = React.useState(new Date())

  React.useEffect(() => {
    const updateToday = () => {
      const now = new Date()
      setToday(now)
    }

    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const timeUntilMidnight = midnight.getTime() - Date.now()

    const timer = setTimeout(() => {
      updateToday()
      setInterval(updateToday, 24 * 60 * 60 * 1000) // Update every 24 hours
    }, timeUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  return today
}

/**
 * useNow
 * returns the current date and time updated every new minute
 */
export const useNow = () => {
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const updateNow = () => {
      setNow(new Date())
    }

    // calculate time until next minute
    const timeUntilNextMinute = 60 * 1000 - (Date.now() % (60 * 1000))

    // update now immediately to ensure `now` is up to date
    const timeoutId = setTimeout(() => {
      updateNow()

      // update every minute
      const intervalId = setInterval(updateNow, 60 * 1000)

      // clean up interval when component is unmounted
      return () => clearInterval(intervalId)
    }, timeUntilNextMinute)

    // clean up timeout when component is unmounted
    return () => clearTimeout(timeoutId)
  }, [])

  return now
}

import { useState, useCallback } from 'react'
import { getWeatherByCity, type WeatherData } from '@/lib/weather-api'
import { saveToCache, getFromCache } from '@/lib/cache-service'

const CACHE_KEY_WEATHER = 'weather_data'

export function useWeatherCache() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeather = useCallback(async (city: string): Promise<WeatherData | null> => {
    const cached = getFromCache<WeatherData>(CACHE_KEY_WEATHER, city)
    
    if (cached) {
      return cached
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getWeatherByCity(city)
      saveToCache(CACHE_KEY_WEATHER, data, city)
      setLoading(false)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
      setLoading(false)
      return null
    }
  }, [])

  return {
    getWeather,
    loading,
    error,
  }
}


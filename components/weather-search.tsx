'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherCache } from '@/hooks/use-weather-cache'
import { useGeolocation } from '@/hooks/use-geolocation'
import { type WeatherData } from '@/lib/weather-api'
import { MapPin } from 'lucide-react'

interface WeatherSearchProps {
  onWeatherChange?: (city: string) => void
}

export function WeatherSearch(props: WeatherSearchProps = {}) {
  const { onWeatherChange } = props
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { getWeather, loading } = useWeatherCache()
  const { getCurrentPosition, error: geoError } = useGeolocation()

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setError(null)

    const data = await getWeather(city)
    if (data) {
      setWeather(data)
      onWeatherChange?.(data.name)
    } else {
      setError('City not found. Please try again.')
      setWeather(null)
    }
  }

  const handleGeolocation = async () => {
    try {
      const position = await getCurrentPosition()
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key'}&units=metric`
      )

      if (response.ok) {
        const data = await response.json()
        setCity(data.name)
        setWeather(data)
        setError(null)
        onWeatherChange?.(data.name)
      }
    } catch (err) {
      setError('Could not get location. Please enter city manually.')
    }
  }

  useEffect(() => {
    if (geoError) {
      setError('Location access denied. Please enter city manually.')
    }
  }, [geoError])

  return (
    <div className="w-full max-w-md space-y-4 transition-all duration-300">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          data-testid="city-input"
        />
        <Button 
          onClick={handleSearch} 
          disabled={loading}
          data-testid="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
        <Button
          onClick={handleGeolocation}
          variant="outline"
          disabled={loading}
          data-testid="geolocation-button"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div 
          className="text-destructive text-sm transition-opacity duration-300" 
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      {weather && (
        <Card 
          data-testid="weather-card"
          className="transition-all duration-300 animate-in fade-in slide-in-from-top-2"
        >
          <CardHeader>
            <CardTitle>
              {weather.name}, {weather.sys.country}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="text-muted-foreground capitalize">
              {weather.weather[0].description}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
              <div>
                <div className="text-muted-foreground">Feels like</div>
                <div className="font-medium">{Math.round(weather.main.feels_like)}°C</div>
              </div>
              <div>
                <div className="text-muted-foreground">Humidity</div>
                <div className="font-medium">{weather.main.humidity}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Wind Speed</div>
                <div className="font-medium">{weather.wind.speed} m/s</div>
              </div>
              <div>
                <div className="text-muted-foreground">Pressure</div>
                <div className="font-medium">{weather.main.pressure} hPa</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


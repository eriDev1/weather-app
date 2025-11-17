'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherByCity, type WeatherData } from '@/lib/weather-api'

export function WeatherSearch() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getWeatherByCity(city)
      setWeather(data)
    } catch (err) {
      setError('City not found. Please try again.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
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
      </div>

      {error && (
        <div 
          className="text-destructive text-sm" 
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      {weather && (
        <Card data-testid="weather-card">
          <CardHeader>
            <CardTitle>
              {weather.name}, {weather.sys.country}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="text-muted-foreground">
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

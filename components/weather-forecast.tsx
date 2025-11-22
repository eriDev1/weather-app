'use client'

import { useState, useEffect, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherForecast, type DailyForecast } from '@/lib/weather-api'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'

interface WeatherForecastProps {
  city: string
}

function getWeatherIcon(iconCode: string) {
  const icon = iconCode.slice(0, 2)
  switch (icon) {
    case '01':
      return Sun
    case '02':
    case '03':
    case '04':
      return Cloud
    case '09':
    case '10':
      return CloudRain
    case '11':
      return CloudLightning
    case '13':
      return CloudSnow
    default:
      return Sun
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

function WeatherForecastCard({ forecast }: { forecast: DailyForecast }) {
  const IconComponent = getWeatherIcon(forecast.icon)
  
  return (
    <Card 
      className="transition-all duration-300 hover:shadow-lg"
      data-testid="forecast-card"
    >
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="font-semibold">{formatDate(forecast.date)}</div>
          <div className="flex items-center gap-2">
            <IconComponent className="h-8 w-8" data-testid="weather-icon" />
            <div>
              <div className="text-2xl font-bold">
                {forecast.tempMax}° / {forecast.tempMin}°
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {forecast.description}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Humidity: {forecast.humidity}% | Wind: {forecast.windSpeed.toFixed(1)} m/s
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const MemoizedForecastCard = memo(WeatherForecastCard)

export function WeatherForecast({ city }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<DailyForecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city.trim()) return

    const fetchForecast = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getWeatherForecast(city)
        setForecast(data)
      } catch (err) {
        setError('Failed to load forecast')
        setForecast([])
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [city])

  if (loading) {
    return (
      <div className="text-center py-8" data-testid="forecast-loading">
        Loading forecast...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive text-center py-8" data-testid="forecast-error">
        {error}
      </div>
    )
  }

  if (forecast.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-4" data-testid="weather-forecast">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((item, index) => (
          <MemoizedForecastCard key={`${item.date}-${index}`} forecast={item} />
        ))}
      </div>
    </div>
  )
}


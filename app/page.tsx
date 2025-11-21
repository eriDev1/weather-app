'use client'

import { useState } from 'react'
import { WeatherSearch } from '@/components/weather-search'
import { WeatherForecast } from '@/components/weather-forecast'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const [currentCity, setCurrentCity] = useState('')

  const handleCityChange = (city: string) => {
    setCurrentCity(city)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Weather App
            </h1>
            <p className="text-muted-foreground mt-2">
              Search for current weather and forecast
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex justify-center">
          <WeatherSearchWrapper onCityChange={handleCityChange} />
        </div>

        {currentCity && (
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-6">
              <div className="flex justify-center">
                <WeatherSearchWrapper onCityChange={handleCityChange} />
              </div>
            </TabsContent>
            <TabsContent value="forecast" className="mt-6">
              <WeatherForecast city={currentCity} />
            </TabsContent>
          </Tabs>
        )}

        {!currentCity && (
          <div className="text-center text-muted-foreground">
            Search for a city to see weather and forecast
          </div>
        )}
      </div>
    </main>
  )
}

function WeatherSearchWrapper({ onCityChange }: { onCityChange: (city: string) => void }) {
  return <WeatherSearch onWeatherChange={(city) => onCityChange(city)} />
}

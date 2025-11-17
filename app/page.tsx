import { WeatherSearch } from '@/components/weather-search'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Weather App
        </h1>
        <p className="text-muted-foreground">
          Search for current weather in any city
        </p>
        <WeatherSearch />
      </div>
    </main>
  )
}

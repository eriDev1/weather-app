export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  dt_txt: string
}

export interface ForecastResponse {
  list: ForecastItem[]
  city: {
    name: string
    country: string
  }
}

export interface DailyForecast {
  date: string
  tempMax: number
  tempMin: number
  icon: string
  description: string
  humidity: number
  windSpeed: number
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key'
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  return response.json()
}

export async function getWeatherForecast(city: string): Promise<DailyForecast[]> {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key'
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data')
  }

  const data: ForecastResponse = await response.json()
  
  const groupedByDate = new Map<string, ForecastItem[]>()
  
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0]
    if (!groupedByDate.has(date)) {
      groupedByDate.set(date, [])
    }
    groupedByDate.get(date)!.push(item)
  })

  const dailyForecasts: DailyForecast[] = []
  
  groupedByDate.forEach((items, date) => {
    const tempMax = Math.max(...items.map(item => item.main.temp_max))
    const tempMin = Math.min(...items.map(item => item.main.temp_min))
    const middayItem = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours()
      return hour >= 12 && hour <= 14
    }) || items[Math.floor(items.length / 2)]
    
    dailyForecasts.push({
      date,
      tempMax: Math.round(tempMax),
      tempMin: Math.round(tempMin),
      icon: middayItem.weather[0].icon,
      description: middayItem.weather[0].description,
      humidity: middayItem.main.humidity,
      windSpeed: middayItem.wind.speed,
    })
  })

  return dailyForecasts.slice(0, 5)
}

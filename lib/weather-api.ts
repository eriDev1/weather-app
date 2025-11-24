const API_KEY = 'f1dad3550f9d44918b8183253252411'

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

interface WeatherAPIResponse {
  location: {
    name: string
    country: string
  }
  current: {
    temp_c: number
    feelslike_c: number
    humidity: number
    pressure_mb: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
  }
}

interface ForecastAPIResponse {
  location: {
    name: string
    country: string
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        avghumidity: number
        condition: {
          text: string
          icon: string
          code: number
        }
        maxwind_kph: number
      }
    }>
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
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data: WeatherAPIResponse = await response.json()

  return {
    name: data.location.name,
    main: {
      temp: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
    },
    weather: [
      {
        id: data.current.condition.code,
        main: data.current.condition.text.split(' ')[0],
        description: data.current.condition.text,
        icon: data.current.condition.icon.replace('//cdn.weatherapi.com', ''),
      },
    ],
    wind: {
      speed: data.current.wind_kph / 3.6,
    },
    sys: {
      country: data.location.country,
    },
  }
}

export async function getWeatherForecast(city: string): Promise<DailyForecast[]> {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data')
  }

  const data: ForecastAPIResponse = await response.json()

  return data.forecast.forecastday.map((day) => ({
    date: day.date,
    tempMax: Math.round(day.day.maxtemp_c),
    tempMin: Math.round(day.day.mintemp_c),
    icon: day.day.condition.icon.replace('//cdn.weatherapi.com', ''),
    description: day.day.condition.text,
    humidity: day.day.avghumidity,
    windSpeed: day.day.maxwind_kph / 3.6,
  }))
}

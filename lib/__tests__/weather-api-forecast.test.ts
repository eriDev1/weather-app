import { getWeatherForecast } from '../weather-api'
import { server } from '@/lib/mocks/server'
import { http, HttpResponse } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Weather Forecast API', () => {
  test('fetches 5-day forecast for valid city', async () => {
    const forecast = await getWeatherForecast('London')

    expect(forecast).toBeDefined()
    expect(Array.isArray(forecast)).toBe(true)
    expect(forecast.length).toBeGreaterThan(0)
    expect(forecast.length).toBeLessThanOrEqual(5)

    forecast.forEach((day) => {
      expect(day).toHaveProperty('date')
      expect(day).toHaveProperty('tempMax')
      expect(day).toHaveProperty('tempMin')
      expect(day).toHaveProperty('icon')
      expect(day).toHaveProperty('description')
    })
  })

  test('handles forecast API error for invalid city', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/forecast', () => {
        return HttpResponse.json(
          { message: 'City not found' },
          { status: 404 }
        )
      })
    )

    await expect(getWeatherForecast('InvalidCity')).rejects.toThrow('Failed to fetch forecast data')
  })

  test('groups forecast data by date', async () => {
    const forecast = await getWeatherForecast('London')

    const dates = forecast.map((day) => day.date)
    const uniqueDates = new Set(dates)

    expect(uniqueDates.size).toBe(forecast.length)
  })

  test('calculates min and max temperatures for each day', async () => {
    const forecast = await getWeatherForecast('London')

    forecast.forEach((day) => {
      expect(day.tempMax).toBeGreaterThanOrEqual(day.tempMin)
      expect(typeof day.tempMax).toBe('number')
      expect(typeof day.tempMin).toBe('number')
    })
  })
})



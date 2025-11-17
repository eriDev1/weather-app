import { getWeatherByCity } from '../weather-api'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Weather API', () => {
  // Test 1: Successfully fetches weather data
  test('fetches weather data for valid city', async () => {
    const data = await getWeatherByCity('London')
    
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('main')
    expect(data).toHaveProperty('weather')
    expect(data.name).toBe('London')
  })

  // Test 2: Throws error for failed request
  test('throws error when API request fails', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 }
        )
      })
    )
    
    await expect(getWeatherByCity('London')).rejects.toThrow(
      'Failed to fetch weather data'
    )
  })

  // Test 3: Handles network errors
  test('handles network errors gracefully', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return HttpResponse.error()
      })
    )
    
    await expect(getWeatherByCity('London')).rejects.toThrow()
  })
})

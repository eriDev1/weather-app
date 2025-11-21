import { renderHook, waitFor } from '@testing-library/react'
import { useWeatherCache } from '../use-weather-cache'
import { server } from '@/lib/mocks/server'
import { getFromCache, saveToCache } from '@/lib/cache-service'

jest.mock('@/lib/cache-service', () => ({
  ...jest.requireActual('@/lib/cache-service'),
  getFromCache: jest.fn(),
  saveToCache: jest.fn(),
}))

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('useWeatherCache Hook', () => {
  test('returns cached data when available', async () => {
    const mockCachedData = {
      name: 'London',
      main: { temp: 20 },
      weather: [{ description: 'clear sky' }],
    }

    ;(getFromCache as jest.Mock).mockReturnValue(mockCachedData)

    const { result } = renderHook(() => useWeatherCache())

    const weather = await result.current.getWeather('London')

    expect(weather).toEqual(mockCachedData)
    expect(getFromCache).toHaveBeenCalledWith('weather_data', 'London')
  })

  test('fetches from API when cache is empty', async () => {
    ;(getFromCache as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useWeatherCache())

    const weather = await waitFor(async () => {
      return await result.current.getWeather('London')
    })

    expect(weather).not.toBeNull()
    expect(weather?.name).toBe('London')
    expect(saveToCache).toHaveBeenCalled()
  })

  test('sets loading state during API fetch', async () => {
    ;(getFromCache as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useWeatherCache())

    const promise = result.current.getWeather('London')

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await promise
  })

  test('handles API errors gracefully', async () => {
    ;(getFromCache as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useWeatherCache())

    const weather = await result.current.getWeather('InvalidCity')

    expect(weather).toBeNull()
    expect(result.current.error).toBeDefined()
  })
})


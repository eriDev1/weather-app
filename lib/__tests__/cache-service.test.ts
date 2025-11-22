import { saveToCache, getFromCache, clearCache } from '../cache-service'

describe('Cache Service', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('saves data to localStorage for caching', () => {
    const testData = { temp: 20, city: 'London' }
    saveToCache('weather_cache', testData, 'London')

    const stored = localStorage.getItem('weather_cache')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    expect(parsed.data).toEqual(testData)
    expect(parsed.city).toBe('London')
    expect(parsed.timestamp).toBeDefined()
  })

  test('reads data from localStorage for requested city', () => {
    const testData = { temp: 20, city: 'London' }
    saveToCache('weather_cache', testData, 'London')

    const cached = getFromCache('weather_cache', 'London')
    expect(cached).toEqual(testData)
  })

  test('returns null for expired cache after 10 minutes', () => {
    const testData = { temp: 20, city: 'London' }
    saveToCache('weather_cache', testData, 'London')

    jest.advanceTimersByTime(10 * 60 * 1000 + 1000)

    const cached = getFromCache('weather_cache', 'London')
    expect(cached).toBeNull()
  })

  test('returns cached data if within 10 minute expiry', () => {
    const testData = { temp: 20, city: 'London' }
    saveToCache('weather_cache', testData, 'London')

    jest.advanceTimersByTime(9 * 60 * 1000)

    const cached = getFromCache('weather_cache', 'London')
    expect(cached).toEqual(testData)
  })

  test('returns null for different city than cached', () => {
    const testData = { temp: 20, city: 'London' }
    saveToCache('weather_cache', testData, 'London')

    const cached = getFromCache('weather_cache', 'Paris')
    expect(cached).toBeNull()
  })

  test('clears cache for specific key', () => {
    saveToCache('weather_cache', { temp: 20 }, 'London')
    saveToCache('forecast_cache', { forecast: [] }, 'London')

    clearCache('weather_cache')

    expect(getFromCache('weather_cache', 'London')).toBeNull()
    expect(getFromCache('forecast_cache', 'London')).not.toBeNull()
  })

  test('clears all cache when no key provided', () => {
    saveToCache('weather_cache', { temp: 20 }, 'London')
    saveToCache('forecast_cache', { forecast: [] }, 'London')

    clearCache()

    expect(getFromCache('weather_cache', 'London')).toBeNull()
    expect(getFromCache('forecast_cache', 'London')).toBeNull()
  })

  test('handles invalid JSON in cache gracefully', () => {
    localStorage.setItem('weather_cache', 'invalid json')

    const cached = getFromCache('weather_cache', 'London')
    expect(cached).toBeNull()
  })
})


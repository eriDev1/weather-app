const CACHE_EXPIRY_MS = 10 * 60 * 1000

interface CachedData<T> {
  data: T
  timestamp: number
  city: string
}

export function saveToCache<T>(key: string, data: T, city: string): void {
  if (typeof window === 'undefined') return

  const cachedItem: CachedData<T> = {
    data,
    timestamp: Date.now(),
    city,
  }

  try {
    localStorage.setItem(key, JSON.stringify(cachedItem))
  } catch (error) {
    console.error('Failed to save to cache:', error)
  }
}

export function getFromCache<T>(key: string, city: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const cachedItem: CachedData<T> = JSON.parse(cached)
    
    if (cachedItem.city !== city) return null
    
    const now = Date.now()
    const isExpired = now - cachedItem.timestamp > CACHE_EXPIRY_MS
    
    if (isExpired) {
      localStorage.removeItem(key)
      return null
    }

    return cachedItem.data
  } catch (error) {
    console.error('Failed to read from cache:', error)
    return null
  }
}

export function clearCache(key?: string): void {
  if (typeof window === 'undefined') return

  try {
    if (key) {
      localStorage.removeItem(key)
    } else {
      localStorage.clear()
    }
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}


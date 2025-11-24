import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }))
      return
    }
  }, [])

  const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setState({
            latitude,
            longitude,
            error: null,
            loading: false,
          })
          resolve({ latitude, longitude })
        },
        (error) => {
          let errorMessage = 'Failed to get location'
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location permission denied'
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information unavailable'
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Location request timeout'
          }

          setState(prev => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }))
          reject(new Error(errorMessage))
        }
      )
    })
  }

  return {
    ...state,
    getCurrentPosition,
  }
}



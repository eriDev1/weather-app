import { renderHook, waitFor } from '@testing-library/react'
import { useGeolocation } from '../use-geolocation'

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('useGeolocation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('detects location automatically with Geolocation API', async () => {
    const mockPosition = {
      coords: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(async () => {
      const position = await result.current.getCurrentPosition()
      expect(position.latitude).toBe(51.5074)
      expect(position.longitude).toBe(-0.1278)
    })

    expect(result.current.latitude).toBe(51.5074)
    expect(result.current.longitude).toBe(-0.1278)
    expect(result.current.loading).toBe(false)
  })

  test('handles geolocation permission denial', async () => {
    const mockError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'User denied geolocation',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(async () => {
      try {
        await result.current.getCurrentPosition()
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })

    expect(result.current.error).toBe('Location permission denied')
    expect(result.current.loading).toBe(false)
  })

  test('handles position unavailable error', async () => {
    const mockError = {
      code: 2,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'Position unavailable',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(async () => {
      try {
        await result.current.getCurrentPosition()
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })

    expect(result.current.error).toBe('Location information unavailable')
  })

  test('handles timeout error', async () => {
    const mockError = {
      code: 3,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'Timeout',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(async () => {
      try {
        await result.current.getCurrentPosition()
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })

    expect(result.current.error).toBe('Location request timeout')
  })

  test('sets loading state during geolocation request', async () => {
    let resolvePosition: ((value: any) => void) | null = null

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      resolvePosition = () => {
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
          },
        })
      }
    })

    const { result } = renderHook(() => useGeolocation())

    const promise = result.current.getCurrentPosition()

    expect(result.current.loading).toBe(true)

    if (resolvePosition) {
      resolvePosition(null)
    }

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})


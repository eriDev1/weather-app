import { render, screen, waitFor } from '@testing-library/react'
import { WeatherForecast } from '../weather-forecast'
import { server } from '@/lib/mocks/server'
import { http, HttpResponse } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('WeatherForecast Component', () => {
  test('renders forecast component', () => {
    render(<WeatherForecast city="London" />)
    expect(screen.getByTestId('forecast-loading')).toBeInTheDocument()
  })

  test('displays 5-day forecast data', async () => {
    render(<WeatherForecast city="London" />)

    await waitFor(() => {
      const forecast = screen.getByTestId('weather-forecast')
      expect(forecast).toBeInTheDocument()
    })

    const cards = screen.getAllByTestId('forecast-card')
    expect(cards.length).toBeGreaterThanOrEqual(1)
  })

  test('shows loading state for forecast data', () => {
    render(<WeatherForecast city="London" />)
    expect(screen.getByTestId('forecast-loading')).toBeInTheDocument()
  })

  test('displays weather icons for each forecast day', async () => {
    render(<WeatherForecast city="London" />)

    await waitFor(() => {
      const icons = screen.getAllByTestId('weather-icon')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  test('handles forecast API error', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/forecast', () => {
        return HttpResponse.json(
          { message: 'City not found' },
          { status: 404 }
        )
      })
    )

    render(<WeatherForecast city="InvalidCity" />)

    await waitFor(() => {
      const error = screen.getByTestId('forecast-error')
      expect(error).toBeInTheDocument()
      expect(error).toHaveTextContent('Failed to load forecast')
    })
  })

  test('displays empty state when city is empty', () => {
    const { container } = render(<WeatherForecast city="" />)
    expect(container.firstChild).toBeNull()
  })
})


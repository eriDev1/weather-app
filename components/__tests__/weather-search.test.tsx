import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeatherSearch } from '../weather-search'
import { server } from '@/lib/mocks/server'
import { http, HttpResponse } from 'msw'

// Setup mock server before all tests
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('WeatherSearch Component', () => {
  // Test 1: Component renders correctly with input and button
  test('renders search input and button', () => {
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')
    
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Search')
  })

  // Test 2: User can type in the input field
  test('accepts user input in city field', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input') as HTMLInputElement
    await user.type(input, 'London')
    
    expect(input.value).toBe('London')
  })

  // Test 3: Shows error when searching with empty input
  test('shows error message for empty city input', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    const error = screen.getByTestId('error-message')
    expect(error).toHaveTextContent('Please enter a city name')
  })

  // Test 4: Displays weather data from mocked API
  test('displays weather data when valid city is searched', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')
    
    await user.type(input, 'London')
    await user.click(button)
    
    await waitFor(() => {
      const weatherCard = screen.getByTestId('weather-card')
      expect(weatherCard).toBeInTheDocument()
    })
    
    expect(screen.getByText(/London/i)).toBeInTheDocument()
    expect(screen.getByText(/20°C/)).toBeInTheDocument()
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument()
  })

  // Test 5: Shows error for invalid city
  test('shows error message when city is not found', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')
    
    await user.type(input, 'InvalidCity')
    await user.click(button)
    
    await waitFor(() => {
      const error = screen.getByTestId('error-message')
      expect(error).toHaveTextContent('City not found. Please try again.')
    })
  })

  // Test 6: Shows loading state during API call
  test('displays loading state while fetching weather', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')
    
    await user.type(input, 'Paris')
    await user.click(button)
    
    expect(button).toHaveTextContent('Searching...')
    expect(button).toBeDisabled()
  })

  // Test 7: Search triggered by Enter key
  test('triggers search when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    
    await user.type(input, 'Berlin{Enter}')
    
    await waitFor(() => {
      const weatherCard = screen.getByTestId('weather-card')
      expect(weatherCard).toBeInTheDocument()
    })
  })

  // Test 8: API request contains correct parameters
  test('sends correct city parameter in API request', async () => {
    let requestUrl = ''
    
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
        requestUrl = request.url
        return HttpResponse.json({
          name: 'Tokyo',
          main: { temp: 25, feels_like: 23, humidity: 70, pressure: 1015 },
          weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
          wind: { speed: 3.5 },
          sys: { country: 'JP' },
        })
      })
    )
    
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const input = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')
    
    await user.type(input, 'Tokyo')
    await user.click(button)
    
    await waitFor(() => {
      expect(requestUrl).toContain('q=Tokyo')
    })
  })
})

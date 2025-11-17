import { http, HttpResponse } from 'msw'

// Mock weather API responses
export const handlers = [
  // Successful weather data response
  http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get('q')
    
    if (!city) {
      return HttpResponse.json(
        { message: 'City name is required' },
        { status: 400 }
      )
    }

    if (city.toLowerCase() === 'invalidcity') {
      return HttpResponse.json(
        { message: 'City not found' },
        { status: 404 }
      )
    }

    // Return mock successful weather data
    return HttpResponse.json({
      name: city,
      main: {
        temp: 20,
        feels_like: 18,
        humidity: 65,
        pressure: 1013,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: {
        speed: 5.5,
      },
      sys: {
        country: 'US',
      },
    })
  }),
]

import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://api.weatherapi.com/v1/current.json', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query) {
      return HttpResponse.json(
        { error: { message: 'City name is required' } },
        { status: 400 }
      )
    }

    if (query.toLowerCase() === 'invalidcity') {
      return HttpResponse.json(
        { error: { message: 'City not found', code: 1006 } },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      location: {
        name: query.includes(',') ? 'Current Location' : query,
        country: 'US',
        lat: query.includes(',') ? parseFloat(query.split(',')[0]) : 0,
        lon: query.includes(',') ? parseFloat(query.split(',')[1]) : 0,
      },
      current: {
        temp_c: 20,
        feelslike_c: 18,
        humidity: 65,
        pressure_mb: 1013,
        condition: {
          text: 'clear sky',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          code: 1000,
        },
        wind_kph: 20,
      },
    })
  }),

  http.get('https://api.weatherapi.com/v1/forecast.json', ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get('q')
    
    if (!city) {
      return HttpResponse.json(
        { error: { message: 'City name is required' } },
        { status: 400 }
      )
    }

    if (city.toLowerCase() === 'invalidcity') {
      return HttpResponse.json(
        { error: { message: 'City not found', code: 1006 } },
        { status: 400 }
      )
    }

    const baseDate = new Date()
    const forecastday = []

    for (let i = 0; i < 5; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)
      
      forecastday.push({
        date: date.toISOString().split('T')[0],
        day: {
          maxtemp_c: 25 + Math.sin(i) * 5,
          mintemp_c: 15 + Math.sin(i) * 3,
          avghumidity: 65 + (i % 10),
          condition: {
            text: ['clear sky', 'few clouds', 'light rain', 'clear sky', 'partly cloudy'][i % 5],
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000 + (i % 4) * 100,
          },
          maxwind_kph: 20 + (i % 3) * 5,
        },
      })
    }

    return HttpResponse.json({
      location: {
        name: city,
        country: 'US',
      },
      forecast: {
        forecastday,
      },
    })
  }),
]

import { http, HttpResponse } from 'msw'

export const handlers = [
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

  http.get('https://api.openweathermap.org/data/2.5/forecast', ({ request }) => {
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

    const baseDate = new Date()
    const list = []

    for (let i = 0; i < 40; i++) {
      const date = new Date(baseDate)
      date.setHours(date.getHours() + i * 3)
      
      list.push({
        dt: Math.floor(date.getTime() / 1000),
        main: {
          temp: 20 + Math.sin(i) * 5,
          temp_min: 15 + Math.sin(i) * 3,
          temp_max: 25 + Math.sin(i) * 7,
          humidity: 65 + i % 10,
        },
        weather: [
          {
            id: 800 + (i % 4) * 100,
            main: ['Clear', 'Clouds', 'Rain', 'Clear'][i % 4],
            description: ['clear sky', 'few clouds', 'light rain', 'clear sky'][i % 4],
            icon: ['01d', '02d', '10d', '01d'][i % 4],
          },
        ],
        wind: {
          speed: 5.5 + (i % 3),
        },
        dt_txt: date.toISOString(),
      })
    }

    return HttpResponse.json({
      list,
      city: {
        name: city,
        country: 'US',
      },
    })
  }),
]

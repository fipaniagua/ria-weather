/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/weatherMockService.ts
import type { HourlyForecastResponse, DailyForecastResponse, Weather } from '@/interfaces/weather'

export const generateMockHourlyForecast = (city: string): HourlyForecastResponse => {
  const now = new Date()

  const intervalHours = 3
  const count = 24
  const cityInfo = getCityInfo(city)

  const list = Array(count / intervalHours)
    .fill(null)
    .map((_, index) => {
      const forecastDate = new Date(now)
      forecastDate.setHours(now.getHours() + index * intervalHours)

      // Determinar si es día o noche para los iconos
      const isDaytime = forecastDate.getHours() > 6 && forecastDate.getHours() < 18
      const timeOfDay = isDaytime ? 'd' : 'n'

      // Seleccionar condición climática aleatoria
      const weatherCondition = { ...getRandomWeatherCondition() }
      // Ajustar icono para día/noche
      weatherCondition.icon = weatherCondition.icon.replace(/.$/, timeOfDay)

      // Generar temperaturas realistas según la ciudad
      const baseTemp = getBaseTemperature(city, forecastDate)
      const variance = Math.random() * 8 - 4 // Variación de -4 a +4 grados
      const temp = baseTemp + variance

      return {
        dt: Math.floor(forecastDate.getTime() / 1000),
        main: {
          temp: temp,
          feels_like: temp - 2 + Math.random() * 4,
          temp_min: temp - 2 - Math.random() * 2,
          temp_max: temp + 2 + Math.random() * 2,
          pressure: 1010 + Math.floor(Math.random() * 20),
          sea_level: 1010 + Math.floor(Math.random() * 20),
          grnd_level: 980 + Math.floor(Math.random() * 20),
          humidity: 40 + Math.floor(Math.random() * 40),
          temp_kf: Math.random() * 2 - 1,
        },
        weather: [weatherCondition],
        clouds: {
          all: Math.floor(Math.random() * 100),
        },
        wind: {
          speed: 2 + Math.random() * 10,
          deg: Math.floor(Math.random() * 360),
          gust: 3 + Math.random() * 15,
        },
        visibility: 10000 - Math.floor(Math.random() * 5000),
        pop: Math.random() * 0.7,
        sys: {
          pod: isDaytime ? 'd' : 'n',
        },
        dt_txt: forecastDate.toISOString().replace('T', ' ').slice(0, 19),
      }
    })

  return {
    cod: '200',
    message: 0,
    cnt: list.length,
    list,
    city: {
      id: cityInfo.id,
      name: city,
      coord: cityInfo.coord,
      country: cityInfo.country,
      population: cityInfo.population,
      timezone: 7200,
      sunrise: Math.floor(new Date(now).setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(new Date(now).setHours(18, 0, 0, 0) / 1000),
    },
  }
}

export const generateMockDailyForecast = (city: string): DailyForecastResponse => {
  const now = new Date()

  // Configuración para pronóstico diario
  const count = 7 // 7 días de pronóstico
  const cityInfo = getCityInfo(city)

  // Generar lista de pronósticos
  const list = Array(count)
    .fill(null)
    .map((_, index) => {
      // Calcular fecha para este ítem de pronóstico
      const forecastDate = new Date(now)
      forecastDate.setDate(now.getDate() + index)

      // Seleccionar condición climática aleatoria
      const weatherCondition = getRandomWeatherCondition()

      // Generar temperaturas realistas según la ciudad
      const baseTemp = getBaseTemperature(city, forecastDate)
      const dayTemp = baseTemp + Math.random() * 4
      const minTemp = baseTemp - 5 - Math.random() * 3
      const maxTemp = baseTemp + 3 + Math.random() * 3
      const nightTemp = baseTemp - 3 - Math.random() * 4
      const eveTemp = baseTemp - 1 + Math.random() * 2
      const mornTemp = baseTemp - 2 - Math.random() * 3

      // Calcular horas de amanecer y atardecer
      const sunrise = new Date(forecastDate)
      sunrise.setHours(6 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0)

      const sunset = new Date(forecastDate)
      sunset.setHours(18 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0)

      return {
        dt: Math.floor(forecastDate.getTime() / 1000),
        sunrise: Math.floor(sunrise.getTime() / 1000),
        sunset: Math.floor(sunset.getTime() / 1000),
        temp: {
          day: dayTemp,
          min: minTemp,
          max: maxTemp,
          night: nightTemp,
          eve: eveTemp,
          morn: mornTemp,
        },
        feels_like: {
          day: dayTemp - 1 + Math.random() * 2,
          night: nightTemp - 1 + Math.random() * 2,
          eve: eveTemp - 1 + Math.random() * 2,
          morn: mornTemp - 1 + Math.random() * 2,
        },
        pressure: 1010 + Math.floor(Math.random() * 20),
        humidity: 40 + Math.floor(Math.random() * 40),
        weather: [weatherCondition],
        speed: 2 + Math.random() * 10,
        deg: Math.floor(Math.random() * 360),
        gust: 3 + Math.random() * 15,
        clouds: Math.floor(Math.random() * 100),
        pop: Math.random() * 0.7,
        // Añadir lluvia o nieve solo si el clima lo requiere
        ...(weatherCondition.main === 'Rain' ? { rain: 1 + Math.random() * 20 } : {}),
        ...(weatherCondition.main === 'Snow' ? { snow: 1 + Math.random() * 10 } : {}),
      }
    })

  // Crear objeto de respuesta de pronóstico
  return {
    city: {
      id: cityInfo.id,
      name: city,
      coord: cityInfo.coord,
      country: cityInfo.country,
      population: cityInfo.population,
      timezone: 7200,
    },
    cod: '200',
    message: 0,
    cnt: list.length,
    list,
  }
}

/**
 * Obtiene información de una ciudad
 */
function getCityInfo(city: string): {
  id: number
  coord: { lat: number; lon: number }
  country: string
  population: number
} {
  const cityLower = city.toLowerCase()

  // Ciudades predefinidas
  if (cityLower.includes('rio') || cityLower.includes('janeiro')) {
    return {
      id: 3451190,
      coord: { lat: -22.9068, lon: -43.1729 },
      country: 'BR',
      population: 6747815,
    }
  } else if (cityLower.includes('beijing') || cityLower.includes('pekin')) {
    return {
      id: 1816670,
      coord: { lat: 39.9042, lon: 116.4074 },
      country: 'CN',
      population: 21542000,
    }
  } else if (cityLower.includes('los angeles') || cityLower.includes('la')) {
    return {
      id: 5368361,
      coord: { lat: 34.0522, lon: -118.2437 },
      country: 'US',
      population: 3971883,
    }
  } else if (cityLower.includes('london') || cityLower.includes('londres')) {
    return {
      id: 2643743,
      coord: { lat: 51.5074, lon: -0.1278 },
      country: 'GB',
      population: 8982000,
    }
  } else if (cityLower.includes('tokyo') || cityLower.includes('tokio')) {
    return {
      id: 1850147,
      coord: { lat: 35.6762, lon: 139.6503 },
      country: 'JP',
      population: 13929286,
    }
  } else if (cityLower.includes('paris')) {
    return {
      id: 2988507,
      coord: { lat: 48.8566, lon: 2.3522 },
      country: 'FR',
      population: 2140526,
    }
  } else if (cityLower.includes('berlin')) {
    return {
      id: 2950159,
      coord: { lat: 52.52, lon: 13.405 },
      country: 'DE',
      population: 3664088,
    }
  } else if (cityLower.includes('sydney')) {
    return {
      id: 2147714,
      coord: { lat: -33.8688, lon: 151.2093 },
      country: 'AU',
      population: 5312163,
    }
  } else if (cityLower.includes('moscow') || cityLower.includes('moscu')) {
    return {
      id: 524901,
      coord: { lat: 55.7558, lon: 37.6173 },
      country: 'RU',
      population: 12537954,
    }
  } else if (cityLower.includes('mexico')) {
    return {
      id: 3530597,
      coord: { lat: 19.4326, lon: -99.1332 },
      country: 'MX',
      population: 9209944,
    }
  }

  // Ciudad genérica con datos aleatorios
  return {
    id: 1000000 + Math.floor(Math.random() * 9000000),
    coord: {
      lat: Math.random() * 180 - 90,
      lon: Math.random() * 360 - 180,
    },
    country: getRandomCountryCode(),
    population: 50000 + Math.floor(Math.random() * 15000000),
  }
}

/**
 * Devuelve un código de país aleatorio
 */
function getRandomCountryCode(): string {
  const countryCodes = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'JP', 'CN', 'IN', 'BR', 'AU', 'CA']
  return countryCodes[Math.floor(Math.random() * countryCodes.length)]
}

/**
 * Obtiene una condición climática aleatoria
 */
function getRandomWeatherCondition(): Weather {
  const weatherConditions: Weather[] = [
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
    { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
    { id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' },
    { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
    { id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' },
    { id: 600, main: 'Snow', description: 'light snow', icon: '13d' },
    { id: 741, main: 'Fog', description: 'fog', icon: '50d' },
  ]

  return weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
}

/**
 * Obtiene temperaturas base según la ciudad y temporada
 */
function getBaseTemperature(city: string, date: Date): number {
  const cityLower = city.toLowerCase()
  const month = date.getMonth() // 0 = enero, 11 = diciembre
  const isNorthernHemisphere = !['br', 'au', 'ar', 'cl', 'za', 'nz'].includes(
    getCityInfo(city).country.toLowerCase(),
  )

  // Determinar si es verano o invierno según el hemisferio
  const isSummer = isNorthernHemisphere ? month >= 5 && month <= 8 : month <= 2 || month >= 11

  // Temperaturas base según la ciudad
  if (cityLower.includes('rio') || cityLower.includes('janeiro')) {
    return isSummer ? 30 : 25
  } else if (cityLower.includes('beijing') || cityLower.includes('pekin')) {
    return isSummer ? 27 : 5
  } else if (cityLower.includes('los angeles') || cityLower.includes('la')) {
    return isSummer ? 25 : 15
  } else if (cityLower.includes('london') || cityLower.includes('londres')) {
    return isSummer ? 22 : 8
  } else if (cityLower.includes('tokyo') || cityLower.includes('tokio')) {
    return isSummer ? 28 : 10
  } else if (cityLower.includes('moscow') || cityLower.includes('moscu')) {
    return isSummer ? 20 : -5
  } else if (cityLower.includes('sydney')) {
    return isSummer ? 28 : 17
  }

  // Temperatura predeterminada si no es una ciudad conocida
  return isSummer ? 25 : 15
}

// Servicio de clima simulado
export const weatherMockService = {
  async getForecastDaily(city: string, lang: string = 'en'): Promise<DailyForecastResponse> {
    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockDailyForecast(city)
  },

  async getForecastHourly(city: string, lang: string = 'en'): Promise<HourlyForecastResponse> {
    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockHourlyForecast(city)
  },
}

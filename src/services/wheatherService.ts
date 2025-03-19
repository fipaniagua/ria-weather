// src/services/weatherService.ts
import type { HourlyForecastResponse, DailyForecastResponse } from '@/interfaces/weather'
import axios from 'axios'
import { weatherMockService } from './wheatherServiceMock'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA !== undefined
    ? import.meta.env.VITE_USE_MOCK_DATA === 'true'
    : true

interface WeatherParams {
  q?: string
  lat?: number
  lon?: number
  appid: string
  lang?: string
  cnt?: number
}

export const weatherService = {
  async getForecastDaily(city: string, lang: string = 'en'): Promise<DailyForecastResponse> {
    // Use mock data if flag is set to true
    if (USE_MOCK_DATA) {
      return weatherMockService.getForecastDaily(city, lang)
    }

    try {
      const params: WeatherParams = {
        q: city,
        appid: API_KEY,
        lang,
        cnt: 7,
      }

      const response = await axios.get<DailyForecastResponse>(`${BASE_URL}/forecast/daily`, {
        params,
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener el pronóstico diario:', error)
      throw error
    }
  },

  async getForecastHourly(city: string, lang: string = 'en'): Promise<HourlyForecastResponse> {
    if (USE_MOCK_DATA) {
      return weatherMockService.getForecastHourly(city, lang)
    }

    try {
      const params: WeatherParams = {
        q: city,
        appid: API_KEY,
        lang,
      }

      const response = await axios.get<HourlyForecastResponse>(`${BASE_URL}/forecast`, { params })
      return response.data
    } catch (error) {
      console.error('Error al obtener el pronóstico por horas:', error)
      throw error
    }
  },
}

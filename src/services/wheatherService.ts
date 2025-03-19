// src/services/weatherService.ts
import type { ForecastResponse } from '@/interfaces/weather'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

interface WeatherParams {
  q?: string
  lat?: number
  lon?: number
  appid: string
  lang?: string
}

export const weatherService = {
  async getForecastDaily(city: string, lang: string = 'en'): Promise<ForecastResponse> {
    try {
      const params: WeatherParams = {
        q: city,
        appid: API_KEY,
        lang,
      }

      const response = await axios.get<ForecastResponse>(`${BASE_URL}/forecast/daily`, { params })
      return response.data
    } catch (error) {
      console.error('Error al obtener el pronóstico:', error)
      throw error
    }
  },

  async getForecastHourly(city: string, lang: string = 'en'): Promise<ForecastResponse> {
    try {
      const params: WeatherParams = {
        q: city,
        appid: API_KEY,
        lang,
      }

      const response = await axios.get<ForecastResponse>(`${BASE_URL}/forecast/hourly`, { params })
      return response.data
    } catch (error) {
      console.error('Error al obtener el pronóstico:', error)
      throw error
    }
  },
}

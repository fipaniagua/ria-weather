// src/stores/weatherStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { weatherService } from '@/services/wheatherService'
import type {
  HourlyForecastResponse,
  DailyForecastResponse,
  City,
  HourlyForecastItem,
  DailyForecastItem,
} from '@/interfaces/weather'

// Ciudades predefinidas según los requisitos
const DEFAULT_CITIES = [
  { name: 'Rio de Janeiro', country: 'BR' },
  { name: 'Beijing', country: 'CN' },
  { name: 'Los Angeles', country: 'US' },
]

// Funciones auxiliares de formato
const formatDay = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const formatHour = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const useWeatherStore = defineStore('weather', () => {
  // Estado reactivo
  const dailyForecast = ref<DailyForecastResponse | null>(null)
  const hourlyForecast = ref<HourlyForecastResponse | null>(null)
  const selectedCity = ref<string>(DEFAULT_CITIES[0].name)
  const defaultCities = ref(DEFAULT_CITIES)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const activeTab = ref<number>(0)
  const searchQuery = ref<string>('')

  const cityInfo = computed<City | null>(() => {
    if (dailyForecast.value) return dailyForecast.value.city
    if (hourlyForecast.value) return hourlyForecast.value.city
    return null
  })

  const dailyForecastData = computed(() => {
    if (!dailyForecast.value) return []

    return dailyForecast.value.list.map((item: DailyForecastItem) => {
      const date = new Date(item.dt * 1000)
      return {
        date,
        day: formatDay(date),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        maxTemp: item.temp.max,
        minTemp: item.temp.min,
        dayTemp: item.temp.day,
        nightTemp: item.temp.night,
        humidity: item.humidity,
        windSpeed: item.speed,
        pop: item.pop * 100,
        item,
      }
    })
  })

  const hourlyForecastData = computed(() => {
    if (!hourlyForecast.value) return []

    return hourlyForecast.value.list.slice(0, 8).map((item: HourlyForecastItem) => {
      const time = new Date(item.dt * 1000)
      return {
        time,
        hour: formatHour(time),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        temp: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        pop: item.pop * 100,
        item,
      }
    })
  })

  const hasWeatherData = computed<boolean>(() => {
    return dailyForecast.value !== null || hourlyForecast.value !== null
  })

  const formattedLastUpdate = computed<string>(() => {
    if (!lastUpdated.value) return ''
    return lastUpdated.value.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  })

  // Acciones
  async function setActiveTab(index: number): Promise<void> {
    activeTab.value = index
    const city = defaultCities.value[index].name
    selectedCity.value = city
    await fetchWeatherData(city)
  }

  async function searchCity(query: string): Promise<void> {
    if (!query.trim()) return

    searchQuery.value = query
    selectedCity.value = query
    await fetchWeatherData(query)
  }

  async function fetchWeatherData(city: string): Promise<void> {
    if (!city.trim()) return

    loading.value = true
    error.value = null

    try {
      const [dailyData, hourlyData] = await Promise.all([
        weatherService.getForecastDaily(city),
        weatherService.getForecastHourly(city),
      ])

      dailyForecast.value = dailyData
      hourlyForecast.value = hourlyData
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar los pronósticos'
      console.error('Error al cargar datos del clima:', err)
    } finally {
      loading.value = false
    }
  }

  async function refreshWeatherData(): Promise<void> {
    await fetchWeatherData(selectedCity.value)
  }

  async function initialize(): Promise<void> {
    await fetchWeatherData(defaultCities.value[0].name)
  }

  return {
    // States
    dailyForecast,
    hourlyForecast,
    selectedCity,
    defaultCities,
    loading,
    error,
    lastUpdated,
    activeTab,
    searchQuery,

    // Getters
    cityInfo,
    dailyForecastData,
    hourlyForecastData,
    hasWeatherData,
    formattedLastUpdate,

    // Acttions
    setActiveTab,
    searchCity,
    fetchWeatherData,
    refreshWeatherData,
    initialize,
  }
})

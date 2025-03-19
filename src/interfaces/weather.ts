export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: City
}

export interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number
  rain?: Rain
  snow?: Snow
  sys: Sys
  dt_txt: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
  temp_kf: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Clouds {
  all: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Rain {
  '1h'?: number
  '3h'?: number
}

export interface Snow {
  '1h'?: number
  '3h'?: number
}

export interface Sys {
  pod: string // 'd' para día, 'n' para noche
}

export interface City {
  id: number
  name: string
  coord: Coordinates
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface HourlyForecastResponse {
  cod: string
  message: number
  cnt: number
  list: HourlyForecastItem[]
  city: City
}

export interface HourlyForecastItem {
  dt: number
  main: {
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
  weather: Weather[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface DailyForecastResponse {
  city: City
  cod: string
  message: number
  cnt: number
  list: DailyForecastItem[]
}

export interface DailyForecastItem {
  dt: number
  sunrise?: number
  sunset?: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  weather: Weather[]
  speed: number
  deg: number
  gust?: number
  clouds: number
  pop: number
  rain?: number
  snow?: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface City {
  id: number
  name: string
  coord: {
    lat: number
    lon: number
  }
  country: string
  population: number
  timezone: number
  sunrise?: number
  sunset?: number
}

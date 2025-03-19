# Weather App

A simple weather application built with Vue 3, TypeScript, Vite, Pinia, and Vuetify.

## Features

- View weather forecasts for three predefined cities (Rio de Janeiro, Beijing, and Los Angeles)
- View hourly and daily forecasts
- Search for additional cities
- Refresh weather data
- Modern UI built with Vuetify

## Setup

1. Clone the repository:

```bash
git clone https://github.com/fipaniagua/ria-weather.git
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env.local` file in the project root with the following variables:

```
VITE_OPENWEATHER_API_KEY=482944e26d320a80bd5e4f23b3de7d1f
VITE_USE_MOCK_DATA=true
```

4. Run the development server:

```bash
npm run dev
```

## Environment Variables

- **VITE_OPENWEATHER_API_KEY** (required): API key for OpenWeatherMap

- **VITE_USE_MOCK_DATA** (optional): Controls whether to use mock data or real API
  - `true`: Use mock data (default if not set)
  - `false`: Use the real OpenWeatherMap API

## Technologies Used

- Vue 3 with Composition API
- TypeScript
- Vite
- Pinia for state management
- Vuetify for UI components

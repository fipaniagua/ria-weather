<template>
  <v-container>
    <v-card>
      <v-card-title class="text-center"> Ria-Weather </v-card-title>

      <v-tabs v-model="tab" bg-color="primary" @update:model-value="handleTabChange">
        <v-tab v-for="(city, index) in defaultCities" :key="index" :value="index">
          {{ city.name }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="searchQuery"
              density="compact"
              variant="outlined"
              label="Search city"
              append-inner-icon="mdi-magnify"
              @click:append-inner="searchCity"
              @keyup.enter="searchCity"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="cityInfo">
          <v-col cols="8">
            <div class="text-h5">{{ cityInfo.name }}, {{ cityInfo.country }}</div>
            <div class="text-caption" v-if="lastUpdateTime">Last updated: {{ lastUpdateTime }}</div>
          </v-col>
          <v-col cols="4" class="text-right">
            <v-btn
              color="primary"
              variant="tonal"
              :loading="loading"
              @click="refreshData"
              prepend-icon="mdi-refresh"
            >
              Refresh
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="loading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-2">Loading weather data...</div>
          </v-col>
        </v-row>

        <v-row v-else-if="error">
          <v-col cols="12">
            <v-alert type="error" variant="tonal">
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>

        <template v-else-if="hasWeatherData">
          <v-row>
            <v-col cols="12">
              <div class="text-h6 mb-2">Hourly Forecast</div>
              <v-sheet class="mx-auto" max-width="100%">
                <v-slide-group show-arrows>
                  <v-slide-group-item v-for="(item, i) in hourlyForecast" :key="i">
                    <v-card width="110" class="ma-2 text-center" variant="outlined">
                      <v-card-text>
                        <div class="text-subtitle-2">{{ item.hour }}</div>
                        <v-img
                          :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
                          height="50"
                          width="50"
                          class="mx-auto"
                          :alt="item.description"
                        ></v-img>
                        <div class="text-h6">{{ Math.round(item.temp) }}°</div>
                        <div class="text-caption text-truncate">
                          {{ item.description }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="text-h6 mb-2">Daily Forecast</div>
              <v-row>
                <v-col v-for="(day, i) in dailyForecast" :key="i" cols="12" sm="6" md="4" lg="2">
                  <v-card variant="outlined" class="text-center">
                    <v-card-text>
                      <div class="text-subtitle-1 font-weight-medium">{{ day.day }}</div>
                      <v-img
                        :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
                        height="60"
                        width="60"
                        class="mx-auto"
                        :alt="day.description"
                      ></v-img>
                      <div class="d-flex justify-center">
                        <span class="text-h6 mr-2">{{ Math.round(day.maxTemp) }}°</span>
                        <span class="text-subtitle-1 text-grey"
                          >{{ Math.round(day.minTemp) }}°</span
                        >
                      </div>
                      <div class="text-caption text-truncate">
                        {{ day.description }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon icon="mdi-weather-cloudy" size="64" color="grey"></v-icon>
            <div class="text-body-1 mt-2">Select a city to view weather data</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useWeatherStore } from '@/stores/wheatherStore'

const weatherStore = useWeatherStore()
const tab = ref(0)
const searchQuery = ref('')

const defaultCities = computed(() => weatherStore.defaultCities)
const cityInfo = computed(() => weatherStore.cityInfo)
const loading = computed(() => weatherStore.loading)
const error = computed(() => weatherStore.error)
const hasWeatherData = computed(() => weatherStore.hasWeatherData)
const hourlyForecast = computed(() => weatherStore.hourlyForecastData)
const dailyForecast = computed(() => weatherStore.dailyForecastData)
const lastUpdateTime = computed(() => weatherStore.formattedLastUpdate)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleTabChange = async (index: any) => {
  await weatherStore.setActiveTab(index)
}

const searchCity = async () => {
  if (!searchQuery.value.trim()) return
  await weatherStore.searchCity(searchQuery.value)
}

const refreshData = async () => {
  await weatherStore.refreshWeatherData()
}

onMounted(async () => {
  await weatherStore.initialize()
})

watch(
  () => weatherStore.activeTab,
  (newValue) => {
    tab.value = newValue
  },
)
</script>

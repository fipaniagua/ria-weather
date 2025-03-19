<script setup lang="ts">
import { onMounted } from 'vue'
import { weatherService } from '@/services/wheatherService'
import WeatherApp from '@/components/WheatherApp.vue'

onMounted(async () => {
  const test = await weatherService.getForecastHourly('Los Angeles')
  console.log(test)
})
</script>

<template>
  <WeatherApp />
</template>

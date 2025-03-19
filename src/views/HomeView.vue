<script setup lang="ts">
import { onMounted } from 'vue'
import { weatherService } from '@/services/wheatherService'

onMounted(async () => {
  const test = await weatherService.getForecastHourly('Los Angeles')
  console.log(test)
})
</script>

<template>
  <main>Hello world</main>
</template>

<script setup lang="ts">
import WeatherApp from './components/WheatherApp.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Ria-Weather</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <WeatherApp />
    </v-main>

    <v-footer app color="primary" class="text-center d-flex justify-center">
      <span class="text-white">Data provided by OpenWeatherMap</span>
    </v-footer>
  </v-app>
</template>

<style scoped></style>

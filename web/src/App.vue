<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <v-app>
    <AppNavbar />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
html, body, #app { height: 100%; margin: 0; }
code { background: #f7f7f7; padding: 2px 6px; border-radius: 6px; }
</style>

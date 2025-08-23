<script setup>
import { ref, onMounted } from 'vue'

const msg = ref('')
const health = ref(null)

async function fetchHello() {
  const res = await fetch('/api/hello')
  const data = await res.json()
  msg.value = data.message
}

onMounted(async () => {
  const res = await fetch('/api/health')
  health.value = await res.json()
})
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-8" style="max-width:780px">
        <v-row>
          <v-col>
            <h1 class="mb-4">Vue + Express + Docker</h1>

            <p class="mb-4">Welcome! This is a minimal starter.</p>

            <v-btn color="primary" @click="fetchHello" class="mb-4">
              <v-icon start>mdi-send</v-icon>
              Call /api/hello
            </v-btn>

            <v-alert v-if="msg" type="success" variant="tonal" class="mb-6">
              <strong>API says:</strong> {{ msg }}
            </v-alert>

            <h3 class="mb-2">Health</h3>
            <v-skeleton-loader v-if="!health" type="paragraph"></v-skeleton-loader>
            <v-card v-else variant="outlined">
              <v-card-text><pre style="margin:0">{{ JSON.stringify(health, null, 2) }}</pre></v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
html, body, #app { height: 100%; margin: 0; }
code { background: #f7f7f7; padding: 2px 6px; border-radius: 6px; }
</style>

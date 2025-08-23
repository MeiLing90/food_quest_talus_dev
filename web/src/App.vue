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
  <main style="max-width:780px;margin:40px auto;padding:24px;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.06);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif">
    <h1 style="margin-top:0">Vue + Express + Docker</h1>

    <section>
      <p>Welcome! This is a minimal starter.</p>
      <button @click="fetchHello" style="padding:8px 14px;border-radius:8px;border:1px solid #ddd;cursor:pointer">
        Call <code>/api/hello</code>
      </button>
      <p v-if="msg" style="margin-top:10px"><strong>API says:</strong> {{ msg }}</p>
    </section>

    <section style="margin-top:24px">
      <h3>Health</h3>
      <pre v-if="health">{{ JSON.stringify(health, null, 2) }}</pre>
    </section>
  </main>
</template>

<style>
html, body, #app { height: 100%; margin: 0; }
code { background: #f7f7f7; padding: 2px 6px; border-radius: 6px; }
</style>

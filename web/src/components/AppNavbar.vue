<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../assets/logo.png' // adjust if you don't use @ alias

const route = useRoute()

const links = [
  { to: '/',               label: 'Meals',    icon: 'mdi-fire' },
  { to: '/food/selected',  label: 'Recipes',  icon: 'mdi-heart-outline' },
  { to: '/quests',         label: 'Quests',   icon: 'mdi-star-outline' },
  { to: '/archive',        label: 'Archive',  icon: 'mdi-archive-outline' },
]

// points state (no store)
const points = ref(0)

async function loadPoints() {
  try {
    const u = await fetch('/api/user').then(r => r.json())
    points.value = Number(u.points ?? 0)
  } catch {
    points.value = 0
  }
}

// simple active check for button styling
const isActive = (to) => route.path === to || (to !== '/' && route.path.startsWith(to))

function onRefresh() {
  loadPoints()
}

onMounted(() => {
  loadPoints()                                   // initial load
  window.addEventListener('user:refresh', onRefresh)
})
onBeforeUnmount(() => {
  window.removeEventListener('user:refresh', onRefresh)
})
</script>

<template>
  <v-app-bar elevation="2" color="white" density="comfortable">
    <!-- Left: brand -->
    <RouterLink to="/" class="brand d-flex align-center text-decoration-none">
      <img :src="logo" alt="FoodQuest" height="28" class="me-2 ml-4" />
      <span class="brand-name" style="color:#56AB2F">FoodQuest</span>
    </RouterLink>

    <v-spacer />

    <!-- Points chip -->
    <v-chip color="primary" variant="flat" prepend-icon="mdi-star" class="mr-2">
      {{ points }} pts
    </v-chip>

    <!-- Right: actions -->
    <nav class="d-flex align-center ga-1 mr-4">
      <v-btn
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :variant="isActive(l.to) ? 'flat' : 'text'"
          :color="isActive(l.to) ? 'primary' : undefined"
          class="text-none"
          :prepend-icon="l.icon"
      >
        <span class="nav-label">{{ l.label }}</span>
      </v-btn>
    </nav>
  </v-app-bar>
</template>

<style scoped>
.brand { color: inherit; }
.brand-name { font-weight: 800; letter-spacing: .4px; }
.text-none { text-transform: none; }

/* Hide labels on very small screens for a cleaner look */
@media (max-width: 600px) {
  .nav-label { display: none; }
}
</style>

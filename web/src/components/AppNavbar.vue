<script setup>
const links = [
  { to: '/',        label: 'Recipes',  icon: 'mdi-fire' },
  { to: '/quests',  label: 'Quests', icon: 'mdi-star-outline' },
  { to: '/archive',  label: 'Archive', icon: 'mdi-archive-outline' },
  // add more when you have routes (e.g. messages/profile)
]
</script>

<template>
  <v-app-bar elevation="2" color="white" density="comfortable">
    <!-- Left: brand -->
    <RouterLink to="/" class="brand d-flex align-center text-decoration-none">
      <img src="/src/assets/logo.png" alt="FoodQuest" height="28" class="me-2 ml-4" />
      <span class="brand-name" style="color: #56AB2F">FoodQuest</span>
    </RouterLink>

    <v-spacer />

    <!-- Right: actions -->
    <nav class="d-flex align-center ga-1 mr-4">
      <v-btn
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          variant="text"
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

/* Hide labels on very small screens for a cleaner Tinder-like look */
@media (max-width: 600px) {
  .nav-label { display: none; }
}
</style>

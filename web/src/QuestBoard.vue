<script setup>
import {ref, computed, onMounted} from 'vue'

const loading = ref(true)
const quests = ref([])
const q = ref('')
const sortBy = ref('recent') // recent | progress | reward

const filtered = computed(() => {
  let list = quests.value.filter(
      x =>
          x.title.toLowerCase().includes(q.value.toLowerCase()) ||
          (x.tags || []).some(t => t.toLowerCase().includes(q.value.toLowerCase()))
  )
  if (sortBy.value === 'progress') list = [...list].sort((a, b) => (b.progress || 0) - (a.progress || 0))
  else if (sortBy.value === 'reward') list = [...list].sort((a, b) => (b.reward || 0) - (a.reward || 0))
  return list
})

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/quests')
    const data = await res.json()
    quests.value = data.items || data || []
  } catch (e) {
    // Fallback demo data
    quests.value = [
      {
        id: 'q1',
        title: 'Eat broccoli',
        summary: 'Cook a meal with broccoli',
        difficulty: 'Easy',
        tags: ['veggie'],
        progress: 0,
        reward: 20,
        image: 'https://images.unsplash.com/photo-1614336215203-05a588f74627?q=80&w=1170&auto=format&fit=crop',
        status: 'not-started'
      },
      {
        id: 'q2',
        title: 'Vegetarian days',
        summary: 'Cook 3 veggie meals',
        difficulty: 'Medium',
        tags: ['veggie', 'healthy'],
        progress: 60,
        reward: 120,
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1600&auto=format&fit=crop',
        status: 'in-progress'
      },
    ]
  } finally {
    loading.value = false
  }
}

// map status -> label/color/icon
function statusMeta(status) {
  switch (status) {
    case 'in-progress':
      return {text: 'In progress', color: 'amber', icon: 'mdi-progress-clock'}
    case 'done':
      return {text: 'Done', color: 'green', icon: 'mdi-check-circle'}
    default:
      return {text: 'Not started', color: 'grey', icon: 'mdi-progress-helper'}
  }
}

/** NEW: apply server-side rule from meal page (“recipe cooked”) */
async function applyRecipeCooked(tags = [], recipeId = 'demo') {
  await fetch('/api/events/recipe-cooked', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({recipeId, tags}) // e.g. ['veggie']
  })
  await load()
}

/** NEW: directly set progress for a quest (quick prototyping) */
async function setQuestProgress(id, progress) {
  const res = await fetch(`/api/quests/${encodeURIComponent(id)}/progress`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({progress}) // 0..100
  })
  if (res.ok) {
    const updated = await res.json()
    const i = quests.value.findIndex(q => q.id === updated.id)
    if (i !== -1) quests.value[i] = updated
  } else {
    await load()
  }
}

onMounted(load)

// (Optional) expose helpers so a parent or console can call them:
// e.g. from devtools: $vm.applyRecipeCooked(['veggie'])
defineExpose({applyRecipeCooked, setQuestProgress, reload: load})
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex flex-wrap align-center mb-6 ga-3">
      <h2 class="text-h5 mb-0">Quest Board</h2>
      <v-spacer></v-spacer>
      <v-text-field
          v-model="q"
          placeholder="Search quests…"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-magnify"
          style="max-width: 280px"
      />
      <v-select
          v-model="sortBy"
          :items="[
          { title:'Recent', value:'recent' },
          { title:'Progress', value:'progress' },
          { title:'Reward', value:'reward' },
        ]"
          label="Sort"
          density="comfortable"
          hide-details
          style="max-width: 160px"
      />
    </div>

    <!-- Loading -->
    <v-row v-if="loading" class="ga-4">
      <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
        <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Empty -->
    <v-alert v-else-if="filtered.length === 0" type="info" variant="tonal">
      No quests found. Try a different search.
    </v-alert>

    <!-- Cards -->
    <v-row v-else class="ga-0">
      <v-col cols="12" sm="6" md="4" class="pa-3" v-for="qt in filtered" :key="qt.id">
        <v-card rounded="xl" elevation="6">
          <v-img :src="qt.image" height="180" cover/>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">{{ qt.title }}</span>
            <v-chip
                size="small"
                :color="qt.difficulty === 'Hard' ? 'red' : qt.difficulty === 'Medium' ? 'amber' : 'primary'"
                variant="tonal"
            >
              {{ qt.difficulty }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div class="mb-2">{{ qt.summary }}</div>
            <div class="d-flex flex-wrap ga-2 mb-3">
              <v-chip v-for="tag in qt.tags" :key="tag" size="x-small" variant="outlined">
                #{{ tag }}
              </v-chip>
            </div>

            <div class="d-flex align-center" v-if="(qt.progress || 0) > 0">
              <v-progress-linear :model-value="qt.progress" height="8" rounded class="flex-grow-1 me-2"/>
              <span class="text-caption">{{ qt.progress }}%</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-chip :color="statusMeta(qt.status).color" variant="tonal" :prepend-icon="statusMeta(qt.status).icon">
              {{ statusMeta(qt.status).text }}
            </v-chip>

            <v-spacer/>

            <v-chip prepend-icon="mdi-star-outline" size="small" variant="tonal">
              {{ qt.reward }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

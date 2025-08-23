<script setup>
import { ref, computed } from 'vue'
import cardsData from '../food.json';

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const card = computed(() =>
    cardsData.find(c => String(c.id) === String(props.id))
)
</script>

<template>
  <div v-if="card">
    <p>{{ card.id }}</p>
    <p>{{ card.name }}</p>
  </div>
  <div v-else>
    <p>Keine Karte gefunden</p>
  </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
const props = defineProps({
  title: String
});
</script>

<template>
  <v-card
      elevation="6"
      class="rounded-xl pa-4 mb-6 mx-auto mt-4"
      max-width="900"
  >
    <v-card-item class="pb-3 ">
      <div class="d-flex align-center justify-space-between">
        <slot name="title">
          <v-card-title class="text-h5 font-weight-medium">
            {{ title }}
          </v-card-title>
        </slot>
        <slot name="action"></slot>
      </div>
    </v-card-item>

    <v-divider class="mb-3"></v-divider>

    <v-card-text class="pt-0">
      <slot />
    </v-card-text>
  </v-card>
</template>

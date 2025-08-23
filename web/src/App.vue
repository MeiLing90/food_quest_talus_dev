<script setup>
import { ref, onMounted } from 'vue'
import FoodList from "./pages/food/FoodList.vue";
import Foodswiper from "./pages/food/FoodSwiper.vue";

</script>

<template>
  <foodswiper></foodswiper>
  <food-list></food-list>
</template>

<style>
html, body, #app { height: 100%; margin: 0; }
code { background: #f7f7f7; padding: 2px 6px; border-radius: 6px; }
</style>


import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../pages/food/FoodTinder.vue') },
    { path: '/food/:id', name: 'food-detail', component: () => import('../pages/food/FoodDetail.vue'), props: true },
    { path: '/quests', component: () => import('../pages/QuestBoard.vue') },
]
export default createRouter({ history: createWebHistory(), routes })

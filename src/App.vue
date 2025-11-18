<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* 可以在这里添加更复杂的转场动画，例如模拟墨迹晕开 */
</style>
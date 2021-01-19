<template>
  <div id="app" class="text-gray-700 dark:text-gray-400">
    <router-view/>
    <!-- Modal Portal -->
    <div id="modal" class="overflow-y-auto"></div>
  </div>
</template>

<style>
.feature-icon {
  stroke:currentColor;
  stroke-linecap:round;
  stroke-linejoin:round;
  fill:none;
  stroke-width:2;
}
</style>

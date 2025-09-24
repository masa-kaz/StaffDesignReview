<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="hero">
    <h1 class="title">{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </section>
</template>

<style scoped>
.hero { text-align: center; padding: 3rem 1rem; }
.title { font-size: 2rem; line-height: 1.2; margin: 0; }
.subtitle { color: #64748b; margin-top: 0.5rem; }
</style>



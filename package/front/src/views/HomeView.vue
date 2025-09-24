<script setup lang="ts">
import HomeTemplate from '@/components/templates/HomeTemplate.vue'

function handleCta() {
  alert('CTA clicked')
}
</script>

<template>
  <HomeTemplate @cta="handleCta" />
</template>

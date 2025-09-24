<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { buttonPrimaryScenarios } from '@/scenarios/atoms/buttonPrimary'

const route = useRoute()
const registry = {
  'atoms/button-primary': buttonPrimaryScenarios,
}

const scenarioKey = computed(() => String(route.query.key || 'atoms/button-primary'))
const variant = computed(() => String(route.query.variant || 'default'))

const scenario = computed(() => registry[scenarioKey.value as keyof typeof registry])
const component = computed(() => scenario.value?.component)
const props = computed(() => scenario.value?.variants?.[variant.value as 'default' | 'longLabel']?.props ?? {})
</script>

<template>
  <div style="padding: 24px">
    <component :is="component" v-bind="props" />
  </div>
</template>

<style scoped></style>



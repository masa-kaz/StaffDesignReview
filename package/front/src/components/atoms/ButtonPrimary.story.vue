<script setup lang="ts">
import { buttonPrimaryScenarios } from '@/scenarios/atoms/buttonPrimary'
</script>

<template>
  <Story title="Atoms/ButtonPrimary">
    <Variant title="default">
      <component :is="buttonPrimaryScenarios.component" v-bind="buttonPrimaryScenarios.variants.default.props" />
    </Variant>
    <Variant title="longLabel">
      <component :is="buttonPrimaryScenarios.component" v-bind="buttonPrimaryScenarios.variants.longLabel.props" />
    </Variant>
  </Story>
</template>



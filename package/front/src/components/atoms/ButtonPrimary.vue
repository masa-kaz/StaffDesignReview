<script setup lang="ts">
defineProps<{ label: string }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="btn-primary" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<style scoped>
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}
.btn-primary:hover {
  background: #2563eb;
}
.btn-primary:active {
  background: #1d4ed8;
}
</style>

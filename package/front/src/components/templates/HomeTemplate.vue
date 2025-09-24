<script setup lang="ts">
import HeaderNav from '@/components/organisms/HeaderNav.vue'
import HeroTitle from '@/components/molecules/HeroTitle.vue'
import ButtonPrimary from '@/components/atoms/ButtonPrimary.vue'

const emit = defineEmits<{ (e: 'cta'): void }>()
</script>

<template>
  <div>
    <HeaderNav />
    <main>
      <HeroTitle title="Staff Design Review" subtitle="Atomic Design + Histoire + Netlify" />
      <div class="cta">
        <ButtonPrimary label="はじめる" @click="emit('cta')" />
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}
.cta {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>

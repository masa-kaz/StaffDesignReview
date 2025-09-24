<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <nav class="nav">
      <RouterLink to="/" class="logo">StaffDesignReview</RouterLink>
      <div class="spacer" />
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header { position: sticky; top: 0; background: #ffffffcc; backdrop-filter: blur(6px); }
.nav { display: flex; gap: 1rem; align-items: center; padding: 0.75rem 1rem; max-width: 960px; margin: 0 auto; }
.spacer { flex: 1; }
.logo { font-weight: 800; color: #0f172a; text-decoration: none; }
 a { color: #334155; text-decoration: none; }
 a.router-link-active { color: #0ea5e9; }
</style>



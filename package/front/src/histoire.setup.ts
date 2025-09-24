import { createPinia } from 'pinia'
import type { App } from 'vue'

export function setupVue3({ app }: { app: App }) {
  app.use(createPinia())
}

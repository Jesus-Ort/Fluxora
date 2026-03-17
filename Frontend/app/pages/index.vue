<template>
  <UPageHero
    title="Fluxora"
    headline="Controla tu dinero sin adivinar"
    description="Registra ingresos, gastos y tu porcentaje de ahorro. Fluxora calcula tu balance real y te dice cuánto puedes gastar sin romper tu meta."
    :links="links"
  />

  <USeparator />

  <UContainer class="py-12 mb-8">

    <h2 class="text-2xl font-semibold text-center mb-6">
      Qué puedes hacer con Fluxora
    </h2>

    <div class="grid md:grid-cols-3 gap-6">

      <UCard>
        <h3 class="font-semibold mb-2">Control total</h3>
        <p class="text-sm text-gray-500">
          Registra ingresos y gastos y mira tu balance en tiempo real.
        </p>
      </UCard>

      <UCard>
        <h3 class="font-semibold mb-2">Regla de ahorro</h3>
        <p class="text-sm text-gray-500">
          Define cuánto quieres ahorrar y Fluxora te dice si vas bien.
        </p>
      </UCard>

      <UCard>
        <h3 class="font-semibold mb-2">Análisis mensual</h3>
        <p class="text-sm text-gray-500">
          Ve tus gastos por categoría y entiende en qué se va tu dinero.
        </p>
      </UCard>

    </div>

  </UContainer>

  <UPageCTA
  title="Empieza a controlar tu dinero hoy"
  description="Crea tu cuenta y mira tu balance en segundos."
  :links="links"
  />

  <UPageLogos
  title="Tecnologías usadas"
  class="mt-8 mb-8"
  marquee
  :items="[
    'i-simple-icons-nodedotjs',
    'i-simple-icons-postgresql',
    'i-simple-icons-supabase',
    'i-simple-icons-vuejs',
    'i-simple-icons-nuxt',
    'i-simple-icons-tailwindcss'
  ]"
  />

  <USeparator />

</template>

<script setup lang="ts">
import guest from '../middlewares/guest'
definePageMeta({
    middleware: guest
})

import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Crear cuenta',
    to: '/register',
    icon: 'i-lucide-user-plus'
  },
  {
    label: 'Iniciar sesión',
    to: '/login',
    variant: 'subtle',
    icon: 'i-lucide-log-in'
  }
])
</script>
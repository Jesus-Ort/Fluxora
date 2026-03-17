<template>
  <UApp>
    <NuxtLayout >
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} | Fluxora` : 'Fluxora',

  meta: [
    { name: 'description', content: 'Fluxora es una aplicación para llevar un control de tus finanzas personales y gestionar tus ingresos, gastos y categorías.' },

    { property: 'og:title', content: 'Fluxora' },
    { property: 'og:description', content: 'Controlador de finanzas personales' },
    { property: 'og:type', content: 'website' },

    { name: 'theme-color', content: '#0f172a' }
  ],

  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  
})
</script>
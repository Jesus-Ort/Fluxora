<template>
  <div class="mt-10 max-w-6xl mx-auto border border-primary-300 dark:border-secondary-300 rounded-2xl shadow-sm p-6 bg-primary-500/5 dark:bg-secondary-500/5">
    
    <div class="flex justify-center mb-6">
      <UInput
        icon="i-lucide-search"
        v-model="globalFilter"
        class="w-full max-w-md"
        color="secondary"
        placeholder="Filter..."
      />
    </div>

    <div class="overflow-x-auto ">
      <UTable
        v-model:global-filter="globalFilter"
        :data="data"
        :columns="columns"
        :loading="loading"
        loading-color="neutral"
        loading-animation="carousel"
        sticky
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  data: any[]
  columns: TableColumn<any>[]
  loading?: boolean
}>()

const globalFilter = ref("")
</script>
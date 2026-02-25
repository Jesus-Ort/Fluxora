<template>
  <UContainer>
    <h2 class="text-2xl text-center mx-auto mt-10">Categories</h2>
    <BaseTable
      :data="data"
      :columns="columns"
      :loading="pending"
    />
  </UContainer>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import BaseTable from '~/components/BaseTable.vue'


type Categorie = {
  type: 'income' | 'expense'
  name: string
}

const { $api } = useNuxtApp()

const data = ref<Categorie[]>([])
const pending = ref(true)
const error = ref<unknown>(null)

onMounted(async () => {
  try {
  const response = await $api.get<Categorie[]>('/categories')
  data.value = response.data
  } catch (err) {
    error.value = err
  } finally {
    pending.value = false
  }
})

const columns: TableColumn<Categorie>[] = [
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  }
]
</script>

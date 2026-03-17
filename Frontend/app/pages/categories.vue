<template>
  <UContainer>
    <h2 class="text-2xl text-center mx-auto mt-10">Categorías</h2>
    
    <BaseTable
      :data="data"
      :columns="columns"
      :loading="pending"
    >  
      <template #agregar>
        <UTooltip text="Agregar">

          <UButton
            icon="i-heroicons-plus"
            color="primary"
            @click="open = true"
          />

        </UTooltip>

        <CreateCategoryModal
          v-model:open="open"
          @created="loadCategories"
        />

      </template>
    </BaseTable>
  </UContainer>
</template>

<script setup lang="ts">
useHead({
  title: 'Categorias'
})

import auth from '../middlewares/auth'
definePageMeta({
  middleware: auth
})

import type { TableColumn } from '@nuxt/ui'
import BaseTable from '~/components/BaseTable.vue'
import CreateCategoryModal from '~/components/CreateCategoryModal.vue'

type Category = {
  id: string
  user_id: string
  name: string
  type: 'Income' | 'Expense'
  created_at: string
}

const open = ref(false)
const { $api } = useNuxtApp()

const data = ref<Category[]>([])
const pending = ref(true)


const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (row.type === 'Income' ? 'Gasto' : 'Ingreso' ),
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  }
]

const loadCategories = async () => {
  try {

    pending.value = true

    const res = await $api.get('/api/v1/categories')

    data.value = res.data.categories

  } catch (err) {

    console.error(err)

  } finally {

    pending.value = false

  }
}

onMounted(loadCategories)

</script>

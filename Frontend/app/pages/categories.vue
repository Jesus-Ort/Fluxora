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
            @click="openCreateCategory = true"
          />

        </UTooltip>

        <CreateCategoryModal
          v-model:open="openCreateCategory"
          @created="loadCategories"
        />

        <UpdateCategoryModal
          v-model:open="openUpdateModal"
          :category="selectedCategory"
          @updated="loadCategories"
        />
        
        <DeleteCategoryModal
          v-model:open="openDeleteModal"
          :category="selectedCategory"
          @deleted="loadCategories"
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
import UpdateCategoryModal from '~/components/UpdateCategoryModal.vue'
import DeleteCategoryModal from '~/components/DeleteCategoryModal.vue'
import type { Row } from '@tanstack/vue-table'

type Category = {
  id: string
  user_id: string
  name: string
  type: 'Income' | 'Expense'
  created_at: string
}

const openCreateCategory = ref(false)
const openUpdateModal = ref(false)
const openDeleteModal = ref(false)
const { $api } = useNuxtApp()

const data = ref<Category[]>([])
const selectedCategory = ref<Category | null>(null)
const pending = ref(true)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type') as string || row.original?.type
      return type === 'Income' ? 'Ingreso' : 'Gasto'
    },
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    id: 'actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: 'end'
          },
          items: getRowItems(row),
          'aria-label': 'Actions dropdown'
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            'aria-label': 'Actions dropdown'
          })
      )
    }
  }
]

function getRowItems(row: Row<Category>) {
  return [
    {
      type: 'label',
      label: 'Acciones'
    },
    {
      type: 'separator'
    },
    {
      label: 'Editar',
      icon: 'i-lucide-square-pen',
      onSelect(){
        selectedCategory.value = row.original
        openUpdateModal.value = true
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Eliminar',
      icon: 'i-lucide-trash',
      onSelect(){
        selectedCategory.value = row.original
        openDeleteModal.value = true
      }
    }
  ]
}

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

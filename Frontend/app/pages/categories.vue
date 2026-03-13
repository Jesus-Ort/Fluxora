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
import type { TableColumn } from '@nuxt/ui'
import BaseTable from '~/components/BaseTable.vue'
import CreateCategoryModal from '~/components/CreateCategoryModal.vue'

type Categorie = {
  type: 'Income' | 'Expense'
  name: string
}

const open = ref(false)
const { $api } = useNuxtApp()

const data = ref<Categorie[]>([])
const pending = ref(true)
const loading = ref(true)

const columns: TableColumn<Categorie>[] = [
  {
    accessorKey: 'type',
    header: 'Tipo'
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  }
]

const loadCategories = async () => {

  loading.value = true

  const res =
    await $api.get('/categories')

  data.value = res.data

  loading.value = false
}

onMounted(loadCategories)

</script>

<template>
  <UContainer>
    <h2 class="text-2xl text-center mx-auto mt-10">Transacciones</h2>
    
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

        <CreateTransactionModal
          v-model:open="open"
          @created="loadTransactions"
        />

      </template>
    </BaseTable>
  </UContainer>
</template>

<script setup lang="ts">
import auth from '../middlewares/auth'
definePageMeta({
  middleware: auth
})

import type { TableColumn } from '@nuxt/ui'
import BaseTable from '~/components/BaseTable.vue'
import CreateTransactionModal from '~/components/CreateTransactionModal.vue'

type Transaction = {
  id: string
  users: {
    name: string
  }
  categories: {
    name: string
  }
  amount: number
  description: string
  transaction_date: string
}

const open = ref(false)
const { $api } = useNuxtApp()

const data = ref<Transaction[]>([])
const pending = ref(true)

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const columns: TableColumn<Transaction>[] = [
  {
    accessorKey: 'profiles.full_name',
    header: 'Usuario'
  },
  {
    accessorKey: 'categories.name',
    header: 'Categoría'
  },
  {
    accessorKey: 'categories.type',
    header: 'Tipo',
    cell: ({ row }) => (row.type === 'Income' ? 'Gasto' : 'Ingreso' ),
  },
  {
    accessorKey: 'amount',
    header: 'Monto'
  },
  {
    accessorKey: 'description',
    header: 'Descripción'
  },
  {
    accessorKey: 'transaction_date',
    header: 'Fecha',
    cell: ({ row }) => {
      return formatDate(row.original.transaction_date)
    }
  }
]

const loadTransactions = async () => {
  try {

    pending.value = true

    const res = await $api.get('/api/v1/transactions')

    data.value = res.data.transactions

  } catch (err) {

    console.error(err)

  } finally {

    pending.value = false

  }
}

onMounted(loadTransactions)

</script>

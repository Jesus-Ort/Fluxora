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
            @click="openCreateTransaction = true"
          />

        </UTooltip>

        <CreateTransactionModal
          v-model:open="openCreateTransaction"
          @created="loadTransactions"
        />
        
        <UpdateTransactionModal
          v-model:open="openUpdateModal"
          :transaction="selectedTransaction"
          @updated="loadTransactions"
        />

        <DeleteTransactionModal
          v-model:open="openDeleteModal"
          :transaction="selectedTransaction"
          @deleted="loadTransactions"
        />
      </template>
    </BaseTable>
  </UContainer>
</template>

<script setup lang="ts">
useHead({
    title: 'Transacciones'
})

import auth from '../middlewares/auth'
definePageMeta({
  middleware: auth
})

import type { TableColumn } from '@nuxt/ui'
import BaseTable from '~/components/BaseTable.vue'
import CreateTransactionModal from '~/components/CreateTransactionModal.vue'
import UpdateTransactionModal from '~/components/UpdateTransactionModal.vue'
import DeleteTransactionModal from '~/components/DeleteTransactionModal.vue'
import type { Row } from '@tanstack/vue-table'

type Transaction = {
  id: string
  category_id: string
  amount: number
  description: string
  type: "Income" | "Expense"
  transaction_date: string
  categories: {
    name: string
    type: "Income" | "Expense"
  }
}

const openCreateTransaction = ref(false)
const openUpdateModal = ref(false)
const openDeleteModal = ref(false)
const { $api } = useNuxtApp()

const data = ref<Transaction[]>([])
const selectedTransaction = ref<Transaction | null>(null)
const pending = ref(true)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const columns: TableColumn<Transaction>[] = [
  {
    accessorKey: 'categories.name',
    header: 'Categoría'
  },
  {
    accessorKey: 'categories.type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = (row.getValue('categories.type') as string) || row.original?.categories?.type
      return type === 'Income' ? 'Ingreso' : 'Gasto'
    },
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
  },{
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

function getRowItems(row: Row<Transaction>) {
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
        selectedTransaction.value = row.original
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
        selectedTransaction.value = row.original
        openDeleteModal.value = true
      }
    }
  ]
}

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

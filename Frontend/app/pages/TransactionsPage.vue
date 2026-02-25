<template>
  <UContainer>
    <h2 class="text-2xl text-center mx-auto mt-10">Transactions</h2>
    <BaseTable
      :data="data || []"
      :columns="columns"
      :loading="pending"
    />
  </UContainer>
</template>

<script setup>
import BaseTable from '~/components/BaseTable.vue'

const { $api } = useNuxtApp()

const data = ref([])
const pending = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await $api.get('/transactions')
    data.value = response.data
  } catch (err) {
    error.value = err
  } finally {
    pending.value = false
  }
})

const columns= [
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    accessorKey: 'date',
    header: 'Date',
      cell: ({ row }) => {
    return new Date(row.getValue('date')).toLocaleDateString()
  }
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  ]
</script>

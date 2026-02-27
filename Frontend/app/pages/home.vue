<template>
  <div class="max-w-6xl mx-auto mt-10 px-4">
    
    <h2 class="text-2xl font-semibold mb-6">Home</h2>

    <UCard>
      <div class="flex flex-col lg:flex-row gap-4 lg:items-end">

        <!-- Tipo -->
        <USelect
          v-model="type"
          :items="typeOptions"
          placeholder="Type"
          class="lg:w-40"
          portal
        />

        <!-- Categoría -->
        <USelect
          v-model="category"
          :items="categories"
          placeholder="Category"
          class="lg:w-52"
          portal
        />

        <!-- Monto -->
        <UInput
          v-model.number="amount"
          type="number"
          placeholder="Amount"
          class="lg:w-40"
        />

        <!-- Descripción -->
        <UInput
          v-model="description"
          placeholder="Description"
          class="flex-1"
        />

        <!-- Botón -->
        <UButton
          color="primary"
          icon="i-heroicons-plus-small-solid"
          class="lg:w-auto w-full"
          :disabled="!isValid"
          @click="handleAdd"
        >
          Add
        </UButton>

      </div>
    </UCard>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const type = ref<string | null>(null)

const typeOptions = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' }
]

const categories = ref([
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Entertainment', value: 'entertainment' }
])

const category = ref<string | null>(null)
const amount = ref<number | null>(null)
const description = ref('')

const isValid = computed(() => {
  return (
    type.value &&
    category.value &&
    amount.value &&
    amount.value > 0 &&
    description.value.trim()
  )
})

function handleAdd() {
  if (!isValid.value) return

  const newTransaction = {
    type: type.value,
    category: category.value,
    amount: amount.value,
    description: description.value
  }

  console.log('New transaction:', newTransaction)

  // Reset
  type.value = null
  category.value = null
  amount.value = null
  description.value = ''
}
</script>
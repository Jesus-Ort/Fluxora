<template>
  <UContainer class="max-w-6xl mx-auto mt-10 px-4 space-y-6">
    <h2 class="text-2xl font-semibold text-center">Dashboard Financiero</h2>

    <!-- Resumen mensual -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Ingresos este mes</p>
          <p class="text-xl font-bold">{{ monthlyRisk?.total_income}}</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Gastos este mes</p>
          <p class="text-xl font-bold">{{ monthlyRisk?.total_expense}}</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Ahorro neto</p>
          <p :class="['text-xl font-bold', riskTextClass(monthlyRisk?.risk_status)]">
            {{ monthlyRisk?.net_savings }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Gráfico de gastos por categoría -->
    <UCard>
      <template #header>
        <div class="text-lg font-semibold text-center">Gastos por categoría</div>
      </template>

      <div v-if="categoryExpenses.length" class="space-y-2">
        <div v-for="c in categoryExpenses" :key="c.category_name" class="flex justify-between">
          <span>{{ c.category_name }}</span>
          <span>{{ c.total_spent }}</span>
        </div>
      </div>

      <p v-else class="text-gray-500 text-sm text-center py-4">
        No se han registrado gastos este mes.
      </p>
    </UCard>

    <!-- Agregar una transacción -->
    <UCard>
      <template #header>
        <div class="text-lg font-semibold text-center">Agregar una transacción</div>
      </template>

        <UTooltip text="Agregar">

          <UButton
            color="primary"
            @click="openTransaction = true"
            block
          >Nueva transacción</UButton>

        </UTooltip>

        <CreateTransactionModal
          v-model:open="openTransaction"
        />

    </UCard>

    <!-- Agregar una categoría -->
    <UCard>
      <template #header>
        <div class="text-lg font-semibold text-center">Agregar una categoría</div>
      </template>

        <UTooltip text="Agregar">

          <UButton
            color="primary"
            @click="openCategory = true"
            block
          >Nueva Categoría</UButton>

        </UTooltip>

        <CreateCategoryModal
          v-model:open="openCategory"
        />

    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import CreateTransactionModal from '~/components/CreateTransactionModal.vue'
import CreateCategoryModal from '~/components/CreateCategoryModal.vue'

const { $api } = useNuxtApp()

// Estado
const pending = ref(true)
const pendingTransactions = ref(true)
const monthlyRisk = ref<any>(null)
const categoryExpenses = ref<any[]>([])
const openTransaction = ref(false)
const openCategory = ref(false)

// Función para color según estado
const riskTextClass = (status: string) => {
  switch (status) {
    case 'ON_TRACK': return 'text-success'
    case 'BELOW_TARGET': return 'text-warning'
    case 'CRITICAL': return 'text-error'
    case 'NO_INCOME': return 'text-gray-700'
    default: return 'text-gray-700'
  }
}

// Cargar datos
const loadDashboard = async () => {
  pending.value = true
  pendingTransactions.value = true

  try {
    const resRisk = await $api.get('/api/v1/dashboard/monthly-risk')
    monthlyRisk.value = resRisk.data.monthly_risk_analysis
    
    const resExpenses = await $api.get('/api/v1/dashboard/category-expenses')
    categoryExpenses.value = resExpenses.data.category_expenses
  } catch (err) {
    console.error(err)
  } finally {
    pending.value = false
    pendingTransactions.value = false
  }
}
onMounted(loadDashboard)
</script>
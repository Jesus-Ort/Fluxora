<template>
  <UContainer class="max-w-6xl mx-auto mt-10 px-4 space-y-6">
    <h2 class="text-2xl font-semibold text-center">Dashboard Financiero</h2>

    <!-- Resumen total de balance del usuario -->
    <h2 class="text-2xl text-center">Balance total</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Total ingreso</p>
          <USkeleton v-if="pendingBalance" class="h-6 w-24 mx-auto" />
          <p v-else class="text-xl font-bold">{{ userBalance?.total_income}}</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Total gastos</p>
          <USkeleton v-if="pendingBalance" class="h-6 w-24 mx-auto" />
          <p v-else class="text-xl font-bold">{{ userBalance?.total_expense}}</p>
        </div>
      </UCard>
    </div>

    <!-- Resumen mensual -->
    <h2 class="text-2xl text-center">Resumen del mes</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Ingresos este mes</p>
          <USkeleton v-if="pendingMonthly" class="h-6 w-24 mx-auto" />
          <p v-else class="text-xl font-bold">{{ monthlyRisk?.total_income}}</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Gastos este mes</p>
          <USkeleton v-if="pendingMonthly" class="h-6 w-24 mx-auto" />
          <p v-else class="text-xl font-bold">{{ monthlyRisk?.total_expense}}</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Ahorro neto</p>
          <USkeleton v-if="pendingMonthly" class="h-6 w-24 mx-auto" />
          <p v-else :class="['text-xl font-bold', riskTextClass(monthlyRisk?.risk_status)]">
            {{ monthlyRisk?.net_savings }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Gráfico de gastos por categoría -->
    <UCard>
      <template #header>
        <div class="text-lg font-semibold text-center">
          Gastos por categoría
        </div>
      </template>

      <!-- LOADING -->
      <div v-if="pendingCategories" class="space-y-2">
        <div v-for="i in 4" :key="i" class="flex justify-between">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-4 w-12" />
        </div>
      </div>

      <!-- DATA -->
      <div
        v-else-if="categoryExpenses.length"
        class="space-y-2"
      >
        <div
          v-for="c in categoryExpenses"
          :key="c.category_name"
          class="flex justify-between"
        >
          <span>{{ c.category_name }}</span>
          <span>{{ c.total_spent }}</span>
        </div>
      </div>

      <!-- EMPTY -->
      <p
        v-else
        class="text-gray-500 text-sm text-center py-4"
      >
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
          @created="loadDashboard"
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
          @created="loadDashboard"
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
const pendingBalance = ref(true)
const pendingMonthly = ref(true)
const pendingCategories = ref(true)
const userBalance = ref<any>(null)
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
  pendingBalance.value = true
  pendingMonthly.value = true
  pendingCategories.value = true

  try {
    const balancePromise = $api.get('/api/v1/dashboard/user-balance')
    const monthlyPromise = $api.get('/api/v1/dashboard/monthly-risk')
    const categoriesPromise = $api.get('/api/v1/dashboard/category-expenses')

    const [resBalance, resRisk, resExpenses] = await Promise.all([
      balancePromise,
      monthlyPromise,
      categoriesPromise
    ])

    userBalance.value = resBalance.data.user_balance
    monthlyRisk.value = resRisk.data.monthly_risk_analysis
    categoryExpenses.value = resExpenses.data.category_expenses

  } catch (err) {
    console.error(err)
  } finally {
  pendingBalance.value = false
  pendingMonthly.value = false
  pendingCategories.value = false
  }
}
onMounted(loadDashboard)
</script>
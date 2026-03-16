<template>
    <UModal
        v-model:open="open"
        title="Agregar nueva transaccion"
        description="Ingresa los datos de la nueva transaccion"
    >

        <template #body>
        <UForm
            :validate-on="['input','blur', 'change']" 
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >

        <!-- Tipo -->
        <UFormField label="Tipo" name="type">
            <USelect
                v-model="state.type"
                :items="typeOptions"
                placeholder="Selecciona un tipo"
                class="w-full"
                portal
            />
        </UFormField>

        <!-- Categoría -->
        <UFormField label="Categoría" name="category_id">
            <USelect
                :loading="pending"
                v-model="state.category_id"
                :items="filteredCategories"
                placeholder="Selecciona una categoría"
                class="w-full"
                portal
            />
                <p
                    v-if="noCategoriesForType"
                    class="text-sm text-orange-500 mt-1"
                >
                    No tienes categorías para este tipo. Crea una primero.
                </p>
        </UFormField>

        <!-- Monto -->
        <UFormField label="Monto" name="amount">
            <UInput
                v-model.number="state.amount"
                type="number"
                placeholder="Ingresa el monto"
                class="w-full"
            />
        </UFormField>

        <!-- Descripción -->
        <UFormField label="Descripción" name="description">
            <UInput
                v-model="state.description"
                placeholder="Agrega una descripción"
                class="w-full"
            />
        </UFormField>

            
            <div class="flex justify-end gap-2">
            <UButton
                label="Cancelar"
                variant="outline"
                color="error"
                @click="open = false"
            />

            <UButton
                label="Agregar"
                type="submit"
                color="success"
                :loading="loading"
            />
            </div>
        </UForm>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const emit = defineEmits(['created'])

const { $api } = useNuxtApp()
const toast = useToast()

const open = defineModel<boolean>('open')
const loading = ref(false)
const pending = ref(true)

const typeOptions = [
    { label: 'Ingreso', value: 'Income' },
    { label: 'Gasto', value: 'Expense' }
]

type CategoryOption = {
    label: string
    value: string
    categoryType: 'Income' | 'Expense'
}

const categories = ref<CategoryOption[]>([])

const filteredCategories = computed(() => {
    if (!state.type) return []

    return categories.value.filter(
        c => c.categoryType === state.type
    )
})

const noCategoriesForType = computed(() => {
    return state.type && filteredCategories.value.length === 0
})

// Esquema Yup
const schema = yup.object({
    type: yup
    .string()
    .oneOf(['Income', 'Expense'])
    .required('Se requiere un tipo'),
    category_id: yup
    .string()
    .required('Selecciona una categoría'),
    amount: yup
    .number()
    .typeError('Monto inválido')
    .positive('El monto debe ser mayor a 0')
    .required('Se requiere un monto'),
    description: yup
    .string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .required('Se requiere una descripción')
})

const state = reactive<{
    type: "Income" | "Expense";
    category_id: string;
    amount: number;
    description: string;
}>({
    type: 'Income',
    category_id: '',
    amount: 1,
    description: ''
})

// Cargar categorías desde API
const loadCategories = async () => {
    try {
        pending.value = true
        const res = await $api.get('/api/v1/categories')
        categories.value = res.data.categories.map((c: any) => ({
        label: c.name,
        value: c.id,
        categoryType: c.type
        }))
    } catch (err) {
        console.error(err)
        toast.add({ title: 'Error', description: 'No se pudieron cargar las categorías', color: 'error' })
    }finally {

    pending.value = false

    }
}

async function onSubmit(
    event: FormSubmitEvent<any>
    ) {
    try {

        loading.value = true

        await $api.post('/api/v1/transactions', event.data)

        toast.add({
        title: 'Categoría creada',
        description: 'Ahora puedes usar la nueva categoría.',
        color: 'success'
        })

        open.value = false

        state.type = 'Income'
        state.category_id = ''
        state.amount = 0
        state.description = ''

        emit('created') 

    } catch (err: any) {

        toast.add({
        title: 'Error',
        description:
            err?.response?.data?.message,
        color: 'error'
        })

    } finally {
        loading.value = false
    }
}

watch(open, (val) => {
    if (val) loadCategories()
})

watch(
    () => state.type,
    () => {
        state.category_id = ''
    }
)
</script>
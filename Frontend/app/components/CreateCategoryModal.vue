<template>
    <UModal
        v-model:open="open"
        title="Agregar nueva categoría"
        description="Ingresa los datos de la nueva categoría"
    >

        <template #body>
        <UForm
            :validate-on="['input','blur', 'change']" 
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >

            <UFormField label="Tipo" name="type">
            <USelect
                v-model="state.type"
                :items="typeOptions"
                class="w-full"
            />
            </UFormField>

            <UFormField label="Nombre" name="name">
                <UInput 
                v-model="state.name" 
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

const open = ref(false)
const loading = ref(false)

const typeOptions = [
    { label: 'Ingreso', value: 'Income' },
    { label: 'Gasto', value: 'Expense' }
]

const schema = yup.object({
    name: yup
    .string()
    .min(5,"Debe contener minimo 5 letras")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .required('El nombre es requerido'),
    type: yup
    .string()
    .oneOf(['Income', 'Expense'], "Se requiere un tipo")
    .required()
})

const state = reactive<{
    name: string;
    type: "Income" | "Expense";
}>({
    name: '',
    type: 'Income'
})

async function onSubmit(
    event: FormSubmitEvent<any>
    ) {
    try {

        loading.value = true

        await $api.post('/categories', event.data)

        toast.add({
        title: 'Categoría creada',
        description: 'Ahora puedes usar la nueva categoría.',
        color: 'success'
        })

        open.value = false

        state.name = ''
        state.type = 'Income'

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

</script>
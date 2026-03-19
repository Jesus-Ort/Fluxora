<template>
    <UModal
        v-model:open="open"
        title="Editar categoría"
        description="Confirma que quieres realizar esta acción."
    >
        <template #body>
        <UForm
            :validate-on="['input','blur','change']"
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
                label="Confirmar"
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

const emit = defineEmits(['updated'])

const props = defineProps<{
    category: {
        id: string
        name : string
        type: "Income" | "Expense"
    } | null
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = defineModel<boolean>('open')
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

const { category } = toRefs(props)

const state = reactive<{
    name: string;
    type: "Income" | "Expense";
}>({
    name: '',
    type: 'Income'
})

watch(category, (newCategory) => {
    if (!newCategory) return

    state.name = newCategory.name
    state.type = newCategory.type
})

async function onSubmit(event: FormSubmitEvent<any>) {
    if (!props.category) return
    try {
        loading.value = true

    await $api.patch(`/api/v1/categories/${props.category.id}/update`, {
    name: state.name,
    type: state.type
    })

        toast.add({ title: 'Categoría actualizada', description: 'Se ha actualizado correctamente.', color: 'success' })
        open.value = false

        state.name = ''
        state.type = 'Income'

        emit('updated')
    } catch (err: any) {
        toast.add({ title: 'Error', description: err?.response?.data?.message || 'Error al actualizar', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
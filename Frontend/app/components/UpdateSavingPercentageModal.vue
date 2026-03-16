<template>
    <UModal
        v-model:open="open"
        title="Actualizar nombre de usuario"
        description="Ingresa tu nuevo nombre de usuario"
    >
        <template #body>
        <UForm
            :validate-on="['input','blur','change']"
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >
                <UFormField 
                label="% de Ahorro" 
                name="saving_percentage" 
                help="Recomendado: 20% (regla financiera 50/30/20)"
                >
                    <UInputNumber class="w-full" v-model="state.saving_percentage"
                    :increment="false"
                    :decrement="false" 
                    :min="1" 
                    :max="100"/>
                </UFormField>

            <div class="flex justify-end gap-2">
            <UButton
                label="Cancelar"
                variant="outline"
                color="error"
                @click="open = false"
            />
            <UButton
                label="Actualizar"
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
const { $api } = useNuxtApp()
const toast = useToast()

const open = defineModel<boolean>('open')
const loading = ref(false)

const state = reactive<{ saving_percentage: number }>({ saving_percentage: 0 })

const schema = yup.object({
    saving_percentage: yup
    .number()
    .min(1, "Debe ser minimo 1%")
    .max(100, "Debe ser máximo 100%")
    .required('Se requiere % de ahorro')
    })

    async function onSubmit(event: FormSubmitEvent<any>) {
    try {
        loading.value = true

        await $api.put('/api/v1/user/saving-percentage', event.data)

        toast.add({ title: 'Éxito', description: 'Porcentaje de ahorro actualizado', color: 'success' })
        open.value = false
        state.saving_percentage = 0
        emit('updated')
    } catch (err: any) {
        toast.add({ title: 'Error', description: err?.response?.data?.message || 'Error al actualizar', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
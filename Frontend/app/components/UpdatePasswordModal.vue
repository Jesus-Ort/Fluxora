<template>
    <UModal
        v-model:open="open"
        title="Actualizar contraseña"
        description="Ingresa tu nueva contraseña"
    >
        <template #body>
        <UForm
            :validate-on="['input','blur','change']"
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >
            <UFormField label="Nueva contraseña" name="newPassword">
            <UInput
                v-model="state.newPassword"
                type="password"
                placeholder="********"
                class="w-full"
            />
            </UFormField>

            <UFormField label="Confirmar contraseña" name="confirmPassword">
            <UInput
                v-model="state.confirmPassword"
                type="password"
                placeholder="********"
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

const state = reactive<{ newPassword: string; confirmPassword: string }>({
    newPassword: '',
    confirmPassword: ''
})

const schema = yup.object({
    newPassword: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('Requerido')
})

async function onSubmit(event: FormSubmitEvent<any>) {
    try {
        loading.value = true

        await $api.put('/api/v1/user/password', { newPassword: state.newPassword })

        toast.add({ title: 'Éxito', description: 'Contraseña actualizada', color: 'success' })
        open.value = false
        state.newPassword = ''
        state.confirmPassword = ''
        emit('updated')
    } catch (err: any) {
        toast.add({ title: 'Error', description: err?.response?.data?.message || 'Error al actualizar', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
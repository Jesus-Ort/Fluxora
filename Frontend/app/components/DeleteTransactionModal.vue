<template>
    <UModal
        v-model:open="open"
        title="Eliminar"
        description="Confirma que quieres realizar esta acción."
    >
        <template #body>
        <UForm
            :validate-on="['input','blur','change']"
            class="space-y-4"
            @submit="onSubmit"
        >   
            <p class="mb-4">
                ¿Seguro que quieres eliminar esta transacción?
            </p>

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
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const emit = defineEmits(['deleted'])

const props = defineProps<{
    transaction: {
        id: string
    } | null
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = defineModel<boolean>('open')
const loading = ref(false)

async function onSubmit() {
    if (!props.transaction) return
    try {
        loading.value = true

        await $api.patch(`/api/v1/transactions/${props.transaction.id}`)

        toast.add({ title: 'Transacción eliminada', description: 'Se ha eliminado correctamente.', color: 'success' })
        open.value = false

        emit('deleted')
    } catch (err: any) {
        toast.add({ title: 'Error', description: err?.response?.data?.message || 'Error al actualizar', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
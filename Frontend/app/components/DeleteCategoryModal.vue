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
                ¿Seguro que quieres eliminar la categoría
                <b>{{ category?.name }}</b>?
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
    category: {
        id: string
        name: string
    } | null
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = defineModel<boolean>('open')
const loading = ref(false)

const { category } = toRefs(props)

async function onSubmit() {
    if (!props.category) return
    try {
        loading.value = true

        await $api.patch(`/api/v1/categories/${props.category.id}/delete`)

        toast.add({ title: 'Categoría eliminada', description: 'Se ha eliminado correctamente.', color: 'success' })
        open.value = false

        emit('deleted')
    } catch (err: any) {
        toast.add({ title: 'Error', description: err?.response?.data?.message || 'Error al actualizar', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
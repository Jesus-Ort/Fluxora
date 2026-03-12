<template>
    <div class="min-h-screen flex items-center justify-center px-4">

        <UCard 
        variant="soft" 
        class="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-sm" 
        >
            <template #header>
                <div class="text-center">
                <h2 class="text-xl font-semibold">Crear cuenta</h2>
                <p class="text-sm text-gray-500 mt-1">
                    Regístrate para comenzar a usar la app.
                </p>
                </div>
            </template>

            <UForm 
                :validate-on="['input','blur', 'change']" 
                :schema="schema" 
                :state="state" 
                class="space-y-4 w-full"
                @submit="onSubmit">

                <UFormField label="Nombre Completo" name="full_name">
                    <UInput class="w-full" placeholder="Ingresa tu nombre" v-model="state.full_name" />
                </UFormField>
    
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
    
                <UFormField label="Correo" name="email">
                    <UInput
                    class="w-full"
                    type="email" 
                    placeholder="Ingresa tu correo" 
                    v-model="state.email" 
                    />
                </UFormField>
    
                <UFormField label="Contraseña" name="password">
                    <UInput 
                    class="w-full"
                    placeholder="Ingresa tu contraseña" 
                    v-model="state.password" 
                    type="password" 
                    />
                </UFormField>
    
                <UButton 
                type="submit" 
                :loading="loading" 
                :disabled="loading"
                block
                >
                    Registrarme
                </UButton>
                </UForm>
                <template #footer>
                    <p class="text-sm text-center text-gray-500">
                    ¿Ya tienes una cuenta?
                    <NuxtLink
                        to="/login"
                        class="text-primary font-medium hover:underline"
                    >
                        Iniciar Sesión
                    </NuxtLink>
                    </p>
                </template>

        </UCard>

    </div>
</template>

<script setup lang="ts">
// definePageMeta({
//     layout: 'auth'
// })

import * as yup from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const { $api } = useNuxtApp()

const loading = ref(false)

// Esquema Yup
const schema = yup.object({
    full_name: yup
    .string()
    .min(5,"Debe contener minimo 5 letras")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .required('El nombre es requerido'),
    email: yup
    .string()
    .email('Correo electrónico no válido')
    .required('Se requiere correo electrónico'),
    password: yup
    .string()
    .matches(/^[^<>[\]{}^`]+$/, 'No se permiten los caracteres < > [ ] { } ` ^')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Se requiere contraseña'),
    saving_percentage: yup
    .number()
    .min(1, "Debe ser minimo 1%")
    .max(100, "Debe ser máximo 100%")
    .required('Se requiere % de ahorro')
})

type Schema = InferType<typeof schema>

const state = reactive({
    full_name: '',
    email: '',
    password: '',
    saving_percentage: 20
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        loading.value = true

        await $api.post('/api/v1/auth/register', event.data)

        toast.add({
        title: 'Cuenta creada',
        description: 'Ahora puedes iniciar sesión.',
        color: 'success'
        })

        await new Promise(r => setTimeout(r, 1200))
        await navigateTo('/login')

    } catch (error: any) {

        const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'No se pudo registrar'

        toast.add({
        title: 'Error',
        description: message,
        color: 'error'
        })
    } finally {
        loading.value = false
    }
}
</script>

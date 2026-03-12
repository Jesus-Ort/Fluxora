<template>
    <div class="min-h-screen flex items-center justify-center px-4">

        <UCard 
        variant="soft" 
        class="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-sm" 
        >
            <template #header>
                <div class="text-center">
                <h2 class="text-xl font-semibold">Iniciar Sesión</h2>
                <p class="text-sm text-gray-500 mt-1">
                    Ingresa tus datos para usar la app.
                </p>
                </div>
            </template>

            <UForm 
                :validate-on="['input','blur', 'change']" 
                :schema="schema" 
                :state="state" 
                class="space-y-4 w-full"
                @submit="onSubmit">
    
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
                    Iniciar Sesión
                </UButton>
                </UForm>
                <template #footer>
                    <p class="text-sm text-center text-gray-500">
                    ¿Aún no tienes una cuenta?
                    <NuxtLink
                        to="/register"
                        class="text-primary font-medium hover:underline"
                    >
                        Regístrate.
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
import { useAuth } from '~/composables/useAuth'

const { $api } = useNuxtApp()

const loading = ref(false)

// Esquema Yup
const schema = yup.object({
    email: yup
    .string()
    .email('Correo electrónico no válido')
    .required('Se requiere correo electrónico'),
    password: yup
    .string()
    .matches(/^[^<>[\]{}^`]+$/, 'No se permiten los caracteres < > [ ] { } ` ^')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Se requiere contraseña'),
})

type Schema = InferType<typeof schema>

const state = reactive({
    email: '',
    password: '',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        loading.value = true

        const { isLogged } = useAuth()
        const res = await $api.post('/api/v1/auth/login', event.data)

        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)

        isLogged.value = true

        toast.add({
        title: 'Sesión iniciada',
        description: 'Ahora puedes usar la app.',
        color: 'success'
        })

        await new Promise(r => setTimeout(r, 800))
        await navigateTo('/home')

    } catch (error: any) {

        const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'No se pudo iniciar la sesión'

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

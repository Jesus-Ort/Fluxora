<template>
    <div class="min-h-screen flex items-center justify-center">
        <UContainer>
        
        <p class="text-sm text-center text-gray-500 mt-4">
            Already have an account?
            <NuxtLink
                to="/login"
                class="text-primary font-medium hover:underline"
            >
                Log in
            </NuxtLink>
        </p>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
// definePageMeta({
//     layout: 'auth'
// })

import * as yup from 'yup'
import useApi from '~/composables/useApi'

const api = useApi()

// Esquema Yup
const schema = yup.object({
    full_name: yup
    .string()
    .min(5,"Debe contener minimo 5 letras")
    .matches(/^[^<>[\]{}^`]+$/, 'No se permiten los caracteres < > [ ] { } ` ^')
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
    .min(0)
    .max(100)
    .required('Se requiere % de ahorro')
})

</script>

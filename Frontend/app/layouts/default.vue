<template>
    <UHeader title="Fluxora" to="/home" :toggle="false">
        <template #right>

        <!-- Dark mode -->
        <UTooltip text="Modo de color">
            <UColorModeButton/>
        </UTooltip>

        <!-- Donate -->
        <UTooltip text="Donar">
            <UButton
            color="neutral"
            variant="ghost"
            to="https://ko-fi.com/jesusort"
            target="_blank"
            icon="i-simple-icons-kofi"
            />
        </UTooltip>
        
        <!-- si NO hay sesión -->
        <!-- Registro -->
        <UButton
            v-if="!isLogged"
            color="neutral"
            variant="solid"
            to="/register"
        >
            Regístrate
        </UButton>

        <!-- Login -->
        <UButton
            v-if="!isLogged"
            color="neutral"
            variant="ghost"
            to="/login"
        >
            Iniciar sesión
        </UButton>

        <!-- si hay sesión -->
        <!-- Menú -->
        <UDropdownMenu
            v-if="isLogged"
            arrow
            size="lg"
            :items="items"
            :ui="{ content: 'w-48' }"
        >
            <UButton
            icon="i-heroicons-user"
            color="neutral"
            variant="outline"
            />
        </UDropdownMenu>

        </template>

    </UHeader>

    <UMain>
        <slot/>
    </UMain>

    <UFooter>
        <template #default>
            <p class="text-muted text-sm">Jesús Ortega | Copyright © {{ new Date().getFullYear() }}</p>
        </template>
    </UFooter>

</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

const { isLogged, checkAuth, logout } = useAuth()

const items: DropdownMenuItem[][] = [
    [
        {
        label: 'Inicio',
        icon: 'i-heroicons-home',
        to: '/home'
        },
        {
        label: 'Transacciones',
        icon: 'i-heroicons-arrows-right-left',
        to: '/transactions'
        },
        {
        label: 'Categorías',
        icon: 'i-heroicons-tag',
        to: '/categories'
        }
    ],
    [
        {
        label: 'Configuración',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings'
        }
    ],
    [
        {
        label: 'Cerrar sesión',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        color: 'error',
        onSelect:  logout
        }
    ]
]

onMounted(() => {
    checkAuth()
})

</script>
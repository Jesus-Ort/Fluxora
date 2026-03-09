<template>
    <UHeader title="Fluxora" to="/home">
        <template #right>

        <!-- Dark mode -->
        
        <UTooltip text="Color mode">
            <UColorModeButton/>
        </UTooltip>

        <!-- Donate -->
        <UTooltip text="Donate">
            <UButton
            color="neutral"
            variant="ghost"
            to="#"
            target="_blank"
            icon="i-heroicons-heart"
            aria-label="Donate"
            />
        </UTooltip>
        
        <!-- Sign Up -->
        <UButton
            color="neutral"
            variant="solid"
            to="/register"
            aria-label="Sign Up"
        >Sign Up</UButton>

        <!-- Log in -->
        <UButton
            color="neutral"
            variant="ghost"
            to="/login"
            aria-label="Log in"
        >Log in</UButton>

        <!-- Menú -->
        <UDropdownMenu
            arrow
            size="lg"
            :items="items"
            :ui="{
            content: 'w-48'
            }">
            <UButton icon="i-heroicons-bars-3" color="neutral" variant="outline" aria-label="Menú" />
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

const items: DropdownMenuItem[][] = [
    [
        {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/home'
        },
        {
        label: 'Transactions',
        icon: 'i-heroicons-arrows-right-left',
        to: '/transactions'
        },
        {
        label: 'Categories',
        icon: 'i-heroicons-tag',
        to: '/categories'
        }
    ],
    [
        {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings'
        }
    ],
    [
        {
        label: 'Log out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        color: 'error',
        onSelect: () => {
            console.log('Logout logic here')
        }
        }
    ]
]
</script>
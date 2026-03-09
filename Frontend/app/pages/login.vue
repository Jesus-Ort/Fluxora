<template>
    <div class="min-h-screen flex items-center justify-center">
        <UContainer>


        <p class="text-sm text-center text-gray-500 mt-4">
            Don't have an account?
            <NuxtLink
                to="/register"
                class="text-primary font-medium hover:underline"
            >
                Create one
            </NuxtLink>
        </p>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
// definePageMeta({
//     layout: 'auth'
// })

</script>

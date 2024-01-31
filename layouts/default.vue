<template>
  <div>
    <NuxtErrorBoundary>
      <NuxtPage />

      <template #error="{ error }">
        <div class="h-screen flex flex-col items-center justify-center">
          <h1 class="text-red-400 font-bold mb-4">
            Sorry, Something went wrong!
          </h1>
          <code>{{ error }}</code>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

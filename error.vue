<script setup>
const handleReturn = () => {
  clearError({
    redirect: "/",
  });
};

const error = useError();
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-8">{{ error.statusCode }}</h1>
    <p class="font-medium mb-10">{{ error.message }}</p>
    <button @click="handleReturn" class="bg-blue-400 px-8 py-3 rounded">
      Go back home
    </button>
  </div>
</template>

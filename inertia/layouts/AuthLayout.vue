<script setup lang="ts">
defineProps<{ messages: Record<string, any> }>()
</script>

<template>
  <div>
    <header>
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="/" class="-m-1.5 p-1.5">
            <span class="sr-only">PlotMyCourse</span>
            <svg
              class="h-8 w-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="6" cy="19" r="3" />
              <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
              <circle cx="18" cy="5" r="3" />
            </svg>
          </a>
        </div>
        <div class="flex flex-1 justify-end gap-4">
          <a href="/register" class="text-sm font-semibold leading-6 text-gray-900">Register</a>
          <a href="/login" class="text-sm font-semibold leading-6 text-gray-900"
            >Login <span aria-hidden="true">&rarr;</span></a
          >
        </div>
      </nav>
    </header>
    <div class="p-6 md:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <slot />
      </div>
    </div>

    <ToastManager :messages="messages" />
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'
import { Loader } from 'lucide-vue-next'

defineOptions({ layout: AuthLayout })

const form = useForm({
  name: '',
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Create An Organization</h1>
    <p class="text-sm text-muted-foreground">
      To get started, you'll need an organization to hold your courses! You can have as many
      organizations as you want.
    </p>
  </div>

  <div class="grid gap-6">
    <form @submit.prevent="form.post('/organizations')">
      <div class="grid gap-3">
        <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />

        <Button :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          Create Organization
        </Button>
      </div>
    </form>
  </div>
</template>

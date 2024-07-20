<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'
import { Loader, AlertCircle } from 'lucide-vue-next'

defineOptions({ layout: AuthLayout })

defineProps<{
  exceptions: Record<string, string>
}>()

const form = useForm({
  email: '',
  password: '',
})
</script>

<template>
  <AppHead title="Login" description="Login to your PlotMyCourse account" />

  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Login</h1>
    <p class="text-sm text-muted-foreground">
      <Link href="/register">Need an account? Register</Link>
    </p>
  </div>

  <div class="grid gap-6">
    <form @submit.prevent="form.post('/login')">
      <Alert v-if="exceptions.E_INVALID_CREDENTIALS" variant="destructive" class="mb-6">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ exceptions.E_INVALID_CREDENTIALS }}</AlertDescription>
      </Alert>

      <div class="grid gap-3">
        <FormInput
          label="Email"
          type="email"
          v-model="form.email"
          :errors="form.errors.email"
          :disabled="form.processing"
        />

        <FormInput
          label="Password"
          type="password"
          v-model="form.password"
          :errors="form.errors.password"
          :disabled="form.processing"
        />

        <Button :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          Login
        </Button>
      </div>
    </form>
  </div>
</template>

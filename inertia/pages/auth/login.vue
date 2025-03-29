<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'
import VueTurnstile from 'vue-turnstile'
import { Loader, AlertCircle } from 'lucide-vue-next'

defineOptions({ layout: AuthLayout })

defineProps<{
  errors: Record<string, string>
}>()

const form = useForm({
  email: '',
  password: '',
  remember: false,
  turnstile: '',
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
      <VueTurnstile site-key="0x4AAAAAAAhP2XDR6i3L_eau" v-model="form.turnstile" />

      <Alert v-if="errors?.E_INVALID_CREDENTIALS" variant="destructive" class="mb-6">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ errors.E_INVALID_CREDENTIALS }}</AlertDescription>
      </Alert>

      <div class="grid gap-3">
        <FormInput
          label="Email"
          type="text"
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

        <div class="flex items-center justify-between flex-wrap gap-4">
          <FormInput type="group" :errors="form.errors.remember">
            <div class="flex items-center gap-2">
              <Checkbox v-model:checked="form.remember" :disabled="form.processing" />
              <span>Remember me</span>
            </div>
          </FormInput>

          <Link href="/forgot-password" class="text-sm underline">Forgot Password</Link>
        </div>

        <Button :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          Login
        </Button>
      </div>
    </form>
  </div>
</template>

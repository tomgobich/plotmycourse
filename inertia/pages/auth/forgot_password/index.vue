<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Info } from 'lucide-vue-next'
import { Loader } from 'lucide-vue-next'
import AuthLayout from '~/layouts/AuthLayout.vue'
import VueTurnstile from 'vue-turnstile'

defineOptions({ layout: AuthLayout })
defineProps<{ isSent: boolean }>()

const turnstileKey = import.meta.env.VITE_TURNSTILE_KEY

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  turnstile: '',
})
</script>

<template>
  <AppHead title="Forget Your Password?" description="Reset your PlotMyCourse password" />

  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Forget Your Password?</h1>
    <p class="text-sm text-muted-foreground">
      No worries! Enter your email below and, if we found a matching account, we will send you a
      password reset link.
    </p>
  </div>

  <Alert v-if="isSent">
    <Info class="h-4 w-4" />
    <AlertTitle>Please Check Your Email</AlertTitle>
    <AlertDescription>
      We have sent a password reset link to your email. Please check your email and click on the
      link to reset your password.
    </AlertDescription>
  </Alert>

  <div class="grid gap-6">
    <form
      @submit.prevent="
        form.post('/forgot-password', { onSuccess: () => form.reset(), preserveScroll: true })
      "
    >
      <VueTurnstile :site-key="turnstileKey" v-model="form.turnstile" />

      <div class="grid gap-3">
        <FormInput
          label="Email"
          type="email"
          v-model="form.email"
          :errors="form.errors.email"
          :disabled="form.processing"
        />

        <Button :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          Email Reset Link
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Info } from 'lucide-vue-next'
import { Loader } from 'lucide-vue-next'
import AuthLayout from '~/layouts/AuthLayout.vue'

defineOptions({ layout: AuthLayout })

const props = defineProps<{ hash: string; isValid: boolean; email: string | null }>()

const form = useForm({
  hash: props.hash,
  password: '',
})
</script>

<template>
  <AppHead title="Reset Your Password" description="Reset your PlotMyCourse password" />

  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Reset Your Password</h1>
    <p class="text-sm text-muted-foreground">Please enter your desired new password below</p>
  </div>

  <div v-if="!isValid">
    <Alert>
      <Info class="h-4 w-4" />
      <AlertTitle>Password Reset Link Invalid</AlertTitle>
      <AlertDescription>
        This password reset link is invalid or has expired. Please try again.
      </AlertDescription>
    </Alert>

    <Button as-child class="mt-3 flex">
      <Link href="/forgot-password">Request New Password Reset Link</Link>
    </Button>
  </div>

  <div v-if="isValid" class="grid gap-6">
    <form
      @submit.prevent="
        form.post('/forgot-password/reset', { onSuccess: () => form.reset(), preserveScroll: true })
      "
    >
      <div class="grid gap-3">
        <FormInput label="Email" type="email" :model-value="email" :disabled="true" />

        <FormInput
          label="New Password"
          type="password"
          v-model="form.password"
          :errors="form.errors.password"
          :disabled="form.processing"
        />

        <Button :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          Reset Password
        </Button>
      </div>
    </form>
  </div>
</template>

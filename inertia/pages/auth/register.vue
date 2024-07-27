<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'
import { Info } from 'lucide-vue-next'
import { Loader } from 'lucide-vue-next'
import AuthLayout from '~/layouts/AuthLayout.vue'

defineOptions({ layout: AuthLayout })

const form = useForm({
  fullName: '',
  email: '',
  password: '',
})
</script>

<template>
  <AppHead
    title="Register"
    description="Start plotting and planning your courses with ease by creating your PlotMyCourse account today"
  />

  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Register</h1>
    <p class="text-sm text-muted-foreground">
      <Link href="/login">Have an account? Login</Link>
    </p>
  </div>

  <Alert>
    <Info class="h-4 w-4" />
    <AlertTitle>Registration coming soon</AlertTitle>
    <AlertDescription>
      This application is still in development. Registration will be open soon, thanks for your
      patience.
    </AlertDescription>
  </Alert>

  <div class="hidden grid gap-6">
    <form @submit.prevent="form.post('/register')">
      <div class="grid gap-3">
        <FormInput
          label="Full Name"
          v-model="form.fullName"
          :errors="form.errors.fullName"
          :disabled="form.processing"
        />

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
          Register
        </Button>
      </div>
    </form>
  </div>

  <p class="text-sm text-muted-foreground">
    By clicking continue, you agree to our
    <a href="/terms" class="underline underline-offset-4 hover:text-primary"> Terms of Service </a>
    and
    <a href="/privacy" class="underline underline-offset-4 hover:text-primary"> Privacy Policy </a>
    .
  </p>
</template>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'
import { Loader } from 'lucide-vue-next'
import FormInput from "~/components/FormInput.vue";

defineOptions({ layout: AuthLayout })

const form = useForm({
  email: '',
  password: '',
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-semibold tracking-tight">Login</h1>
    <p class="text-sm text-muted-foreground">
      <Link href="/register">Need an account? Register</Link>
    </p>
  </div>

  <div class="grid gap-6">
    <form @submit.prevent="form.post('/login')">
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

  <!-- <p class="px-8 text-center text-sm text-muted-foreground">
    By clicking continue, you agree to our
    <a href="/terms" class="underline underline-offset-4 hover:text-primary"> Terms of Service </a>
    and
    <a href="/privacy" class="underline underline-offset-4 hover:text-primary"> Privacy Policy </a>
    .
  </p> -->
</template>

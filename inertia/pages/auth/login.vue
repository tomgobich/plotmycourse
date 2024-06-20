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
        <div class="grid gap-1">
          <Label for="email"> Email </Label>
          <Input
            id="email"
            v-model="form.email"
            placeholder="name@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="form.processing"
          />
        </div>
        <div class="grid gap-1">
          <Label for="password"> Password </Label>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            auto-capitalize="none"
            auto-correct="off"
            :disabled="form.processing"
          />
        </div>
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

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'
import { Loader } from 'lucide-vue-next'

defineOptions({ layout: AuthLayout })

const form = useForm({
  email: '',
  password: '',
})
</script>

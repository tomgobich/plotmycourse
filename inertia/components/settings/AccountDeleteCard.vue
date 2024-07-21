<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'

defineProps<{ email: string }>()

const form = useForm({
  email: '',
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Delete Account</CardTitle>
      <CardDescription> Delete your account and all your data. </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        id="accountDeleteForm"
        class="grid gap-4"
        @submit.prevent="form.delete('/settings/account')"
      >
        <FormInput
          v-model="form.email"
          label="Please enter your account email to confirm deletion"
          type="email"
          :placeholder="email"
          :errors="form.errors.email"
          required
        />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button form="accountDeleteForm" type="submit"> Delete Account </Button>
    </CardFooter>
  </Card>
</template>

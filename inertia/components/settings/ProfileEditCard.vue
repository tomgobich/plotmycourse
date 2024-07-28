<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import UserDto from '#dtos/user'
import { watchEffect } from 'vue'
import { Loader } from 'lucide-vue-next'

const props = defineProps<{ user: UserDto }>()

const form = useForm({
  fullName: props.user.fullName,
})

watchEffect(() => form.defaults({ fullName: props.user.fullName }).reset())
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Update Profile</CardTitle>
      <CardDescription> Update your profile. </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        id="accountEmailForm"
        class="grid gap-4"
        @submit.prevent="
          form.put('/settings/profile', { onSuccess: () => form.reset(), preserveScroll: true })
        "
      >
        <FormInput v-model="form.fullName" label="Full Name" :errors="form.errors.fullName" />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button form="accountEmailForm" type="submit">
        <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
        Update Profile
      </Button>
    </CardFooter>
  </Card>
</template>

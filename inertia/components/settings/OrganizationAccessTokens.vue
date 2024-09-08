<script setup lang="ts">
import { ref } from 'vue'
import { Loader } from 'lucide-vue-next'
import axios from "axios";

const isDialogShown = ref(false)
const permissionOptions = ['read', 'update', 'delete']
const form = ref({
  name: '',
  permissions: new Set(['read']),
})

const processing = ref(false)
const errors = ref<Record<string, string>>({})
const token = ref(null)

async function onSubmit() {
  processing.value = true

  const { data } = await axios.post('/settings/organization/access-tokens', {
    name: form.value.name,
    permissions: [...form.value.permissions],
  })

  token.value = data.token.value

  processing.value = false
}
</script>

<template>
  <Card>
    <CardHeader class="relative">
      <CardTitle>Organization Access Tokens</CardTitle>
      <CardDescription>
        Manage tokens your organization can use to access our API.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Name </TableHead>
            <TableHead> Permissions </TableHead>
            <TableHead> Created </TableHead>
            <TableHead> Last Used </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- <TableRow v-for="member in users" :key="member.id">
            <TableCell>
              {{ member.fullName }}
              <span v-if="user.id === member.id" class="text-slate-400 italic inline-block ml-3">
                (You)
              </span>
            </TableCell>
            <TableCell>
              {{ member.email }}
            </TableCell>
            <TableCell>
              {{ getRoleName(member.meta.pivot_role_id) }}
            </TableCell>
            <TableCell>
              <Link
                v-if="user.id !== member.id"
                :href="`/settings/organization/user/${member.id}`"
                method="delete"
                class="text-red-500"
                preserve-scroll
              >
                Remove
              </Link>
            </TableCell>
          </TableRow> -->
        </TableBody>
      </Table>

      <div class="flex justify-end mt-4">
        <Button type="button" @click="isDialogShown = true"> Add Access Token </Button>
      </div>
    </CardContent>
  </Card>

  <Dialog v-model:open="isDialogShown">
    <DialogContent v-if="!token">
      <DialogHeader v-if="token">
        <DialogTitle> Access Token Created </DialogTitle>
      </DialogHeader>

      <p>
        Please copy your access token below and store it somewhere safe. Once this dialog is closed, you will not be able to see your token again.
      </p>
      <p>
        {{ token }}
      </p>

      <DialogFooter>
        <Button type="submit" :disabled="processing" form="accessTokenDialog">
          <Loader v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
          Close Dialog, I've Stored My Token
        </Button>
      </DialogFooter>
    </DialogContent>
    <DialogContent v-else>
      <DialogHeader>
        <DialogTitle> Add Access Token </DialogTitle>
      </DialogHeader>

      <form
        id="accessTokenDialog"
        @submit.prevent="onSubmit"
      >
        <FormInput
          label="Name"
          type="text"
          class="flex-1"
          v-model="form.name"
          :errors="errors.name"
          :disabled="processing"
        />

        <div class="flex flex-col gap-1 my-3">
          <Label>Permissions</Label>

          <FormInput type="group" :errors="errors.permissions">
            <div v-for="option in permissionOptions" :key="option" class="flex items-center gap-2">
              <Checkbox
                :checked="form.permissions.has(option)"
                @update:checked="
                  $event ? form.permissions.add(option) : form.permissions.delete(option)
                "
                :disabled="processing"
              />
              <span class="capitalize">{{ option }}</span>
            </div>
          </FormInput>
        </div>
      </form>

      <DialogFooter>
        <Button type="submit" :disabled="processing" form="accessTokenDialog">
          <Loader v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
          Create Access Token
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

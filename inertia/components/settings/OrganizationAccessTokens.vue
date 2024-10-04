<script setup lang="ts">
import { ref } from 'vue'
import { Loader, Clipboard, ClipboardCheck, Trash2 } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { router } from '@inertiajs/vue3'
import axios from 'axios'
import AccessTokenDto from '#dtos/access_token'
import { useResourceActions } from '../../composables/resource_actions'
import TokenActions from '#enums/token_actions'

defineProps<{ tokens: AccessTokenDto[] }>()

const isDialogShown = ref(false)
const permissionOptions = Object.values(TokenActions)
const form = ref({
  name: '',
  permissions: new Set(['read']),
})

const { destroy } = useResourceActions<AccessTokenDto>()({})
const processing = ref(false)
const errors = ref<Record<string, string>>({})
const token = ref<string | null>(null)
const isCopied = ref(false)
let copiedTimeout: NodeJS.Timeout | null = null

async function onSubmit() {
  processing.value = true

  const { data } = await axios.post('/settings/organization/access-tokens', {
    name: form.value.name,
    permissions: [...form.value.permissions],
  })

  token.value = data.accessToken.token

  processing.value = false

  router.reload({ only: ['accessTokens'] })
}

function onCopy() {
  clearTimeout(copiedTimeout!)

  navigator.clipboard.writeText(token.value!)
  isCopied.value = true

  copiedTimeout = setTimeout(() => (isCopied.value = false), 1000)
}

function onClose() {
  isDialogShown.value = false
  token.value = null
  errors.value = {}
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
          <TableRow v-for="item in tokens" :key="item.id">
            <TableCell>
              {{ item.name }}
            </TableCell>
            <TableCell class="capitalize">
              {{ item.abilities.join(', ') }}
            </TableCell>
            <TableCell>
              {{ DateTime.fromISO(item.createdAt).toLocaleString() }}
            </TableCell>
            <TableCell>
              <span v-if="item.lastUsedAt">
                {{ DateTime.fromISO(item.lastUsedAt).toLocaleString() }}
              </span>
              <span v-else class="text-slate-600"> N/A </span>
            </TableCell>
            <TableCell>
              <Button variant="destructive" size="xs" @click="destroy.open(item)">
                <Trash2 class="w-3 h-3" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="flex justify-end mt-4">
        <Button type="button" @click="isDialogShown = true"> Add Access Token </Button>
      </div>
    </CardContent>
  </Card>

  <ConfirmDestroyDialog
    v-model:open="destroy.isOpen"
    title="Delete Access Token?"
    :action-href="`/settings/organization/access-tokens/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> access token? It will become immediately unusable
    and cannot be restored.
  </ConfirmDestroyDialog>

  <Dialog v-model:open="isDialogShown">
    <DialogContent v-if="token">
      <DialogHeader>
        <DialogTitle> Access Token Created </DialogTitle>
      </DialogHeader>

      <p>
        Please copy your access token below and store it somewhere safe. Once this dialog is closed,
        you <span class="font-semibold">will not be able to access your token again</span>.
      </p>

      <div class="relative">
        <Input type="text" :model-value="token" />
        <Button
          variant="outline"
          size="icon"
          class="absolute right-1 top-1 !w-8 !h-8 z-20 shadow-md"
          @click="onCopy"
        >
          <ClipboardCheck v-if="isCopied" class="w-4 h-4 text-green-500" />
          <Clipboard v-else class="w-4 h-4" />
        </Button>
        <div
          class="absolute right-1 top-px w-32 h-[calc(100%-2px)] z-10 bg-gradient-to-r from-transparent to-white"
        ></div>
      </div>

      <DialogFooter>
        <Button type="submit" :disabled="processing" form="accessTokenDialog" @click="onClose">
          <Loader v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
          Got my token! Close dialog
        </Button>
      </DialogFooter>
    </DialogContent>
    <DialogContent v-else>
      <DialogHeader>
        <DialogTitle> Add Access Token </DialogTitle>
      </DialogHeader>

      <form id="accessTokenDialog" @submit.prevent="onSubmit">
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

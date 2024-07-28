<script setup lang="ts">
import { Menu, Slash, Route } from 'lucide-vue-next'
import OrganizationDto from '#dtos/organization'
import type { Abilities } from '#actions/abilities/get_abilities'

const props = defineProps<{
  organization: OrganizationDto
  organizations: OrganizationDto[]
  can: Abilities
}>()
</script>

<template>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    <a href="/courses" class="flex items-center gap-2 text-lg font-semibold md:text-base">
      <Route class="h-6 w-6" />
      <span class="sr-only">PlotMyCourse</span>
    </a>
    <div class="flex items-center">
      <Slash class="text-slate-300 w-4 h-4 -rotate-12" />
      <OrganizationSelect v-bind="props" />
      <Slash class="text-slate-300 w-4 h-4 -rotate-12" />
    </div>
    <Link
      href="/courses"
      class="desktop-link"
      :class="{ active: $page.url.startsWith('/courses') }"
    >
      Courses
    </Link>
    <Link
      href="/difficulties"
      class="desktop-link"
      :class="{ active: $page.url.startsWith('/difficulties') }"
    >
      Difficulties
    </Link>
    <Link
      href="/statuses"
      class="desktop-link"
      :class="{ active: $page.url.startsWith('/statuses') }"
    >
      Statuses
    </Link>
    <Link
      href="/access-levels"
      class="desktop-link"
      :class="{ active: $page.url.startsWith('/access-levels') }"
    >
      Accesses
    </Link>
  </nav>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="grid gap-6 text-lg font-medium">
        <a href="/courses" class="flex items-center gap-2 text-lg font-semibold">
          <Route class="h-6 w-6" />
          <span class="sr-only">PlotMyCourse</span>
        </a>
        <a
          href="/courses"
          class="mobile-link"
          :class="{ active: $page.url.startsWith('/courses') }"
        >
          Courses
        </a>
        <a
          href="/difficulties"
          class="mobile-link"
          :class="{ active: $page.url.startsWith('/difficulties') }"
        >
          Difficulties
        </a>
        <a
          href="/statuses"
          class="mobile-link"
          :class="{ active: $page.url.startsWith('/statuses') }"
        >
          Statuses
        </a>
        <a
          href="/access-levels"
          class="mobile-link"
          :class="{ active: $page.url.startsWith('/access-levels') }"
        >
          Access
        </a>
      </nav>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
.desktop-link {
  @apply text-muted-foreground transition-colors hover:text-foreground;

  &.active {
    @apply text-foreground;
  }
}

.mobile-link {
  @apply text-muted-foreground hover:text-foreground;

  &.active {
    @apply text-foreground;
  }
}
</style>

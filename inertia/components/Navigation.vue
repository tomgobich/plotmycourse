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
    <Link href="/courses" class="text-muted-foreground transition-colors hover:text-foreground">
      Courses
    </Link>
    <Link
      href="/difficulties"
      class="text-muted-foreground transition-colors hover:text-foreground"
    >
      Difficulties
    </Link>
    <Link href="/statuses" class="text-muted-foreground transition-colors hover:text-foreground">
      Statuses
    </Link>
    <Link
      href="/access-levels"
      class="text-muted-foreground transition-colors hover:text-foreground"
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
        <a href="#" class="flex items-center gap-2 text-lg font-semibold">
          <Route class="h-6 w-6" />
          <span class="sr-only">PlotMyCourse</span>
        </a>
        <a href="#" class="text-muted-foreground hover:text-foreground"> Courses </a>
        <a href="#" class="text-muted-foreground hover:text-foreground"> Difficulties </a>
        <a href="#" class="text-muted-foreground hover:text-foreground"> Statuses </a>
        <a href="#" class="hover:text-foreground"> Access </a>
      </nav>
    </SheetContent>
  </Sheet>
</template>

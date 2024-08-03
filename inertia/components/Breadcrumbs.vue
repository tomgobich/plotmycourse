<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

defineProps<{
  items: Array<{ name: string; href: string }>
}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in items" :key="item.name">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="item.href" as-child>
            <Link :href="item.href">
              {{ item.name }}
            </Link>
          </BreadcrumbLink>
          <BreadcrumbPage v-else>
            {{ item.name }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < items.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

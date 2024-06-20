/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp, Link } from '@inertiajs/vue3'
import AppLayout from '~/layouts/AppLayout.vue'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
    let page = pages[`../pages/${name}.vue`]
    page.default.layout = page.default.layout || AppLayout
    return page
  },

  setup({ el, App, props, plugin }) {
    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .component('Link', Link)
      .mount(el)
  },
})

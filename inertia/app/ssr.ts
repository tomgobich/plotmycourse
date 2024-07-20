import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp, Link } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import AppLayout from '~/layouts/AppLayout.vue'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: async (name) => {
      const vpage = await resolvePageComponent(
        `../pages/${name}.vue`,
        import.meta.glob<DefineComponent>('../pages/**/*.vue')
      )
      vpage.default.layout = vpage.default.layout || AppLayout
      return vpage
    },

    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) })
        .component('Link', Link)
        .use(plugin)
    },
  })
}

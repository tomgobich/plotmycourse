import UserDto from '#dtos/user'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => ctx.auth.use('web').user && new UserDto(ctx.auth.use('web').user),
    errors: (ctx) => ctx.session.flashMessages.get('errors') ?? {},
    exceptions: (ctx) => ctx.session.flashMessages.get('errorsBag') ?? {},
    messages: (ctx) => ctx.session.flashMessages.all() ?? {},
    qs: (ctx) => ctx.request.qs(),
  },

  /**
   * Options for the server-side rendering
   */

  entrypoint: 'inertia/app/app.ts',
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}

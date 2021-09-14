import {} from "vee-validate"

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    VeeForm: typeof import('vee-validate')['Form']
    VeeField: typeof import('vee-validate')['Field']
    ErrorMessage: typeof import('vee-validate')['ErrorMessage']
  }
}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    requiresAuth?: boolean
    // must be declared by every route
  }
}

export {}
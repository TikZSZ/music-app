import {DocumentData,Firestore,CollectionReference} from "@firebase/firestore/dist/lite"
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
declare module '@firebase/firestore/dist/lite'{
  export declare function collection<T= DocumentData>(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<T>;
}

export {}
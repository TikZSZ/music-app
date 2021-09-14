import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import {State} from "./store/State"


declare module '@vue/runtime-core' {
  // declare your own store states
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
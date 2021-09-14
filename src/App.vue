<template>
  <!-- Header -->
  <AppHeader />

  <!-- Introduction -->
  <router-view>
  </router-view>

  <!-- Player -->
  <Player />

 <AuthModal v-if="getModalState" />
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState } from "vuex";
import AuthModal from "./components/Auth/Auth.vue";
import AppHeader from "./components/Header.vue";
import Player from "./components/Player.vue";

export default defineComponent({
  name:"App",
  components:{
    AppHeader,
    AuthModal,
    Player
  },
  computed:{
    ...mapState({
      getModalState: "authModalShow"
    }),
  },
  mounted(){
    if(document.getElementById('app')!.clientWidth<640){
      this.$store.commit('toggleMobile')
    }
  },
  created(){
    this.$store.dispatch('init_login')
  },
})
</script>
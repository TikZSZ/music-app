<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link exact-active-class="no-active" class="text-white font-bold uppercase text-2xl mr-4" :to="{name:'Home'}">
        Music
      </router-link>
      <div class="flex flex-grow items-center ">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
           <li>
              <router-link to="/about" class="px-2 text-white" href="#">About</router-link>
            </li>
          <li v-if="!isLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template  v-else >
            <li>
              <router-link :to="{name:'Manage'}" class="px-2 text-white" href="#">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">
                Logout
              </a>
            </li>
          </template>
          
        </ul>
      </div>
      <!-- User Name -->
      <div v-if="userName" class="mx-auto mr-20 "  >
      <!-- style="color: #F59E0B;" -->
        <p class="absolute text-white "  :class="{'-my-6':isMobile,'-my-2.5':!isMobile}" >
          Welcome {{userName}}
        </p>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapMutations,mapState } from "vuex";

export default defineComponent({
  name:'Header',
  methods:{
    ...mapMutations(['toggleAuthModal']),
    async logOut(){
      // logout   
      await this.$store.dispatch('logOut')

      // check if the current route needs auth then redirect else stay
      if(this.$route.meta.requiresAuth){
        this.$router.push({name:'Home'})
      }
    }
  },
  computed:{
    ...mapState(['isLoggedIn','userName','isMobile'])
  }
})
</script>
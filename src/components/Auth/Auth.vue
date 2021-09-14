<template>
  <!-- Auth Modal -->
  <div class="fixed z-10 md:inset-0 -inset-1 overflow-y-auto" :class="{ hidden: !getModalState }" id="modal">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click.prevent="toggleAuthModal">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="getButtonStyle(showingLogin)"
                @click.prevent="toggleForm"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="getButtonStyle(!showingLogin)"
                href="#"
                @click.prevent="toggleForm"
                >Register</a
              >
            </li>
          </ul>

          <!-- Login Form -->
          <div v-show="showingLogin">
            <LoginForm />
          </div>

          <!-- Registration Form -->
          <div v-show="!showingLogin">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapMutations, mapState } from "vuex";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";

export default defineComponent({
  name: "Auth",
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      showingLogin: true,
    }
  },
  computed: {
    //simple getter
    //...mapState(['authModalShow']),
    // named getter for state
    ...mapState({
      getModalState: "authModalShow",
    })
  },
  methods: {
    ...mapMutations(["toggleAuthModal"]),
    toggleForm() {
      this.showingLogin = !this.showingLogin;
    },
    getButtonStyle(showingLogin: boolean) {
      return {
        "bg-blue-600": showingLogin,
        "text-white": showingLogin,
        "hover:text-white": showingLogin,
        "hover:text-blue-600": !showingLogin
      };
    }
  }
});
</script>

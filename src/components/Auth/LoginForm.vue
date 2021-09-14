<template>
    <div class="text-white text-center font-bold py-4 mb-4" :class="loginAlertStyle" v-if="showLoginAlert" >
    <p>
      {{loginAlertMsg}}
    </p>                 
    <atom-spinner
      v-if="showLoader"
      class="text-center mx-auto"
      :animation-duration="800"
      :size="50"
      :color="'#000'"
    />        
  </div>
  <!-- Form -->
  <VeeForm  :validation-schema="loginSchema" @submit="loginSubmit">
    <!-- Email And Password -->
    <div
      class="mb-3"
      v-for="{ label, field_name, field_type, placeholder } of loginInputFields"
      :key="field_name"
    >
      <CustomField :label="label" :field_name="field_name">
        <VeeField
          :name="field_name"
          :type="field_type"
          :validate-on-input="!isMobile"
          :class="fieldStyle"
          :placeholder="placeholder"
        />
      </CustomField>
    </div>
    <!-- Login Btn -->
    <button
      type="submit"
      :disabled="loginInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState,mapActions } from "vuex";
import CustomField from "../CustomFieldWrapper.vue";
import {AtomSpinner} from "epic-spinners"


interface LoginSchema {
  email: string;
  password: string;
}

export default defineComponent({
  name: "LoginForm",
  components: {
    CustomField,
    AtomSpinner
  },
  data() {
    return {
      showLoader:false,
      loginInSubmission:false,
      showLoginAlert:false,
      loginAlertStyle: 'bg-blue-500',
      loginAlertMsg:'Please wait! We are logging You in',

      loginSchema: {
        email: "required|min:3|max:100|email",
        password: "required|min:8|max:32|"
      } as LoginSchema,
      loginInputFields: [
        {
          label: "Email",
          field_name: "email",
          field_type: "text",
          placeholder: "Enter email"
        },
        {
          label: "Password",
          field_name: "password",
          field_type: "password",
          placeholder: "Enter Password",
        }
      ]
    }
  },
  computed:{
    fieldStyle() {
      return `block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded`;
    },
    ...mapState(['isMobile'])
  },
  methods:{
    ...mapActions(['login']),
    async loginSubmit(values: LoginSchema) {
      this.login_submitState();
      // auth user
      try {
        await this.login(values)
      }
      catch (err:any) {
        //handle error
        console.log(err.code)
        this.login_errorState();
        const msg = {
          "auth/wrong-password":"Email or Password is incorrect",
          "auth/user-not-found":"User doesn't exist",
          "defaultError":"An unexpected error occured. Plrease try again later"
        } as any
        this.loginAlertMsg = msg[err.code]!==undefined?msg[err.code]:msg['default'] ;
        return 
      }
      // handle success
      this.login_successState();
      this.loginAlertMsg = "Success! Logged in.";
    },
    login_submitState() {
      this.loginInSubmission = true;
      this.showLoginAlert = true;
      this.loginAlertStyle = "bg-blue-500";
      this.loginAlertMsg = "Please wait! We are logging You in'";
      this.showLoader = true;
    },
    login_successState() {
      this.showLoader = false;
      this.loginAlertStyle = "bg-green-500";
    },
    login_errorState() {
      this.showLoader = false;
      this.loginAlertStyle = "bg-red-500";
      this.loginInSubmission = false;
    }
  }
})
</script>
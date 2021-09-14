<template>
  <!-- Loader -->
  <div
    class="text-white text-center font-bold py-4 mb-4"
    :class="regAlertStyle"
    v-if="showRegAlert"
  >
    <p class="p-2">
      {{ regAlertMsg }}
    </p>
    <BreedingRhombusSpinner
      v-if="showLoader"
      class="text-center mx-auto"
      :animation-duration="800"
      :size="50"
      :color="'#000'"
    />
  </div>
  <!-- Form -->
  <VeeForm
    :validation-schema="registerationSchema"
    @submit="regSubmit"
    :initial-values="defaultUserData"
  >
    <!-- Name, Email, Age, Password And Confirm Password -->
    <div
      class="mb-3"
      v-for="{ label, field_name, field_type, placeholder, errMsg } of registerationInputFields"
      :key="field_name"
    >
      <CustomField :label="label" :field_name="field_name" :errMsg="errMsg">
        <VeeField
          :name="field_name"
          :type="field_type"
          :validate-on-input="!isMobile"
          :class="fieldStyle"
          :placeholder="placeholder"
        >
        </VeeField>
      </CustomField>
    </div>

    <!-- Country -->
    <div class="mb-3">
      <CustomField label="Country" field_name="country" errMsg="Please Select Your Country">
        <VeeField name="country" as="select" :class="fieldStyle" :validate-on-input="!isMobile">
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
        </VeeField>
      </CustomField>
    </div>

    <!-- TOS -->
    <div class="mb-3 pl-6">
      <CustomField
        label="Accept terms of service"
        field_name="tos"
        errMsg="Please Accept Terms And Conditions"
      >
        <VeeField
          name="tos"
          :validate-on-input="!isMobile"
          type="checkbox"
          class="w-4 h-4 block float-left -ml-6 mt-1 rounded"
        />
        <br />
      </CustomField>
    </div>
    <!-- Register Btn -->
    <button
      type="submit"
      :disabled="regInSubmission"
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
import { BreedingRhombusSpinner } from "epic-spinners";
import { RegistrationSchema } from "./RegisterFormSchema";


export default defineComponent({
  name: "RegitserForm",
  components: {
    CustomField,
    BreedingRhombusSpinner
  },
  data() {
    return {
      defaultUserData: {
        country: "USA"
      },
      showRegAlert: false,
      regInSubmission: false,
      regAlertStyle: "bg-blue-500",
      regAlertMsg: "Please wait! Your account is being created.",
      showLoader: false,

      registerationSchema: {
        name: "required|min:3|max:100|alpha_spaces:true",
        email: "required|min:3|max:100|email",
        age: "required|numeric|age_min_value:10|age_max_value:100",
        password: "required|min:8|max:32|",
        confirmPassword: "confirmed:@password",
        country: "required",
        tos: {
          is: true
        }
      } as RegistrationSchema,

      registerationInputFields: [
        {
          label: "Name",
          field_name: "name",
          field_type: "text",
          placeholder: "Enter Name"
        },
        {
          label: "Email",
          field_name: "email",
          field_type: "text",
          placeholder: "Enter email"
        },
        {
          label: "Age",
          field_name: "age",
          field_type: "number",
          placeholder: "Enter Age"
        },
        {
          label: "Password",
          field_name: "password",
          field_type: "password",
          placeholder: "Enter Password"
        },
        {
          label: "Confirm Password",
          field_name: "confirmPassword",
          field_type: "password",
          placeholder: "Confirm Password",
          errMsg: "Password didn't match"
        }
      ]
    };
  },
  computed: {
    fieldStyle() {
      return `block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded`;
    },
    ...mapState(["isMobile"])
  },
  methods: {
    ...mapActions(['register']),

    async regSubmit(values: RegistrationSchema) {
      this.reg_submitState();    
      // auth user
      try {
        await this.register(values)
      } 
      // handler errors
      catch (err:any) {
        console.log(err)
        this.reg_errorState();
        if (err.code === "auth/email-already-in-use") {
          this.regAlertMsg = "The email is already in use";
          return;
        }
        if (err.code === "auth/weak-password") {
          this.regAlertMsg = "Password is not strong enough";
          return;
        }
        this.regAlertMsg = "An unexpected error occured. Plrease try again later";
        return 
      }
      this.reg_successState();
      this.regAlertMsg = "Success! Your account has been created.";
    },

    reg_submitState() {
      this.regInSubmission = true;
      this.showRegAlert = true;
      this.regAlertStyle = "bg-blue-500";
      this.regAlertMsg = "Please wait! Your account is being created.";
      this.showLoader = true;
    },
    reg_successState() {
      this.showLoader = false;
      this.regAlertStyle = "bg-green-500";
    },
    reg_errorState() {
      this.showLoader = false;
      this.regAlertStyle = "bg-red-500";
      this.regInSubmission = false;
    }
  }
});
</script>

<template>
  <label class="inline-block mb-2" v-if="label">{{label}}</label>
  <slot :field_name="field_name"></slot>
  <ErrorMessage :name="field_name"  #default="defaultErrMessage">
    <slot name="err">
      <span class="text-red-600">
        {{errMsg?errMsg:defaultErrMessage.message}}
      </span>
    </slot>
  </ErrorMessage>
</template>


<script lang="ts">import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name:"CustomField",
  props:{
    field_name:{type:String,required:true},
    label:{type:String},
    errMsg:{type:String}
  }
})
</script>
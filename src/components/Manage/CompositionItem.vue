<template>
  <div class="border border-gray-200 p-3 py-5 mt-5 mb-4 rounded">
    <div v-if="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song?.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.once.prevent="deleteSong">
        <i class="fa fa-times"></i>
      </button>
      <button
        @click.prevent="toggleForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <!-- song modified_name and genre for submission -->
    <div v-if="showForm">
      <div
        v-if="show_alert"
        :class="alert_variant"
        class="text-center text-white font-bold py-4 mb-4 "
      >
        <p>
          {{ alert_msg }}
        </p>
      </div>
      <VeeForm
        :validation-schema="songSchema"
        :initial-values="{ modified_name: song.modified_name, genre: song.genre }"
        @submit="edit"
      >
        <!--  modified_name -->
        <div class="mb-3">
          <CustomFieldWrapper
            :field_name="'modified_name'"
            #default="{field_name}"
            :label="'Song Title'"
          >
            <VeeField
              label="song title"
              :name="field_name"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 rounded"
              placeholder="Enter Song Title"
              @input="$emit('updateUnsavedFlag',true)"
            />
          </CustomFieldWrapper>
        </div>
        <!-- genre -->
        <div class="mb-3">
          <CustomFieldWrapper :field_name="'genre'" #default="{field_name}" :label="'Genre'">
            <VeeField
              :name="field_name"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 rounded"
              placeholder="Enter Genre"
              @input="$emit('updateUnsavedFlag',true)"
            />
          </CustomFieldWrapper>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 mr-1  rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          @click.prevent="toggleForm"
          :disabled="in_submission"
          type="button"
          class="py-1.5 px-3 ml-1 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script lang="ts">
import { fireStorage } from "@/includes/firebase/fireStorage";
import { fireStore, Song, SongDoc } from "@/includes/firebase/fireStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState } from "vuex";
import CustomFieldWrapper from "../CustomFieldWrapper.vue";

export default defineComponent({
  name: "CompositionItem",
  components: {
    CustomFieldWrapper
  },
  props: {
    song: {
      type: Object as PropType<Song>,
      required: true
    },
    index:{
      type:Number,
      required:true
    }
  },
  data() {
    return {
      showForm: false,
      songSchema: {
        modified_name: "required",
        genre: "alpha_spaces"
      },
      alert_msg: "Submitting",
      in_submission: false,
      alert_variant: "bg-blue-500",
      show_alert: false
    };
  },
  computed:{
    ...mapState(['uid'])
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      this.show_alert = this.show_alert ? !this.show_alert : this.show_alert;
    },
    async edit(values: { modified_name: string; genre: string }) {
      this.show_alert = true;
      this.in_submission = true;
      this.alert_variant = "bg-blue-500";
      this.alert_msg = "Please wait! Updating song info.";

      if(this.song.modified_name === values.modified_name && this.song.genre===values.genre){
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "No data was changed";
        return 
      }
      try {
        await fireStore.updateDoc("songs", {...values,uid:this.uid}, this.song.docId);
        
      } catch (err) {
        console.log(err.code);
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "Something went wrong! Try again later";
        return;
      }
      this.$emit('updateUnsavedFlag',false)
      this.$emit('updateSong',this.index,values)
      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_msg = "Success!"; 
    },
    async deleteSong(){
      try{
        await fireStorage.deleteObject(`songs/${this.song.orginal_name}`)
        await fireStore.deleteDoc("songs",this.song.docId)
      }catch(err){

      }
      this.$emit('removeSong',this.index)
    }
  },
  emits: {
    updateSong: (index: number,updatedvalues: { modified_name: string; genre: string;  }) => {
      return !!index;
    },
    removeSong:(index:number)=>!!index,
    updateUnsavedFlag:(value:boolean)=>true
  }
});
</script>

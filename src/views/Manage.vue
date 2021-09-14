<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload @add-song="addSong" ref="upload" />
      </div>
      <div class="col-span-2 my-5 md:my-0">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-if="songs.length >= 1"
              @updateSong="updateSong"
              @remove-song="removeSong"
              @update-unsaved-flag="updateUnsavedFlag"
              v-for="(song, index) in songs"
              :song="song"
              :index="index"
              :key="song.docId"
            />
            <div v-if="!loading && songs.length === 0" class="text-center bg-gray-200 py-40">
              <p>Upload your songs to view them here</p>
            </div>
          </div>
        </div>
        <div v-if="loading">
        <div class="text-center  py-28">
          <ScalingSquaresSpinner  class="text-center  mx-auto"
          :animation-duration="800"
          :size="100"
          :color="'black'" 
          />
          <p class="mt-5">
            Loading...
          </p>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Upload from "../components/Manage/Upload.vue";
import { fireAuth } from "@/includes/firebase/fireAuth";
import { fireStore, where, SongDoc, Song } from "@/includes/firebase/fireStore";
import { defineComponent } from "@vue/runtime-core";
import CompositionItem from "../components/Manage/CompositionItem.vue";
import {ScalingSquaresSpinner} from "epic-spinners"

export default defineComponent({
  name: "Manage",
  data() {
    return {
      songs: [] as Song[],
      unsavedFlag:false,
      loading:true
    };
  },
  components: {
    Upload,
    CompositionItem,
    ScalingSquaresSpinner:ScalingSquaresSpinner
  },
  methods:{
    updateSong(i: number, updatedvalues: { modified_name: string; genre: string }) {
      const { modified_name, genre } = updatedvalues;
      this.songs[i].modified_name = modified_name;
      this.songs[i].genre = genre;
    },
    removeSong(index:number){
      this.songs.splice(index,1) 
    },
    addSong(song:SongDoc & { docId: string }){
      this.songs.unshift(song)
    },
    updateUnsavedFlag(value:boolean){
      this.unsavedFlag = value
    }
  },
  async created(){
    const { docs } = await fireStore.getDocs<SongDoc>(
      "songs",
      where("uid", "==", fireAuth.currentUser()!.uid)
    );
    const songs = docs.map(document => {
      return { ...document.data(), docId: document.id };
    });
    this.songs = songs
    this.loading = false
  },
  beforeRouteLeave(to, from, next) {
    const uploadComponent = (this.$refs as any).upload as InstanceType<typeof Upload>;
    uploadComponent.cancelUploads();
    if(this.unsavedFlag){
      const leave = confirm('You have unsaved changes. Are you sure you want to leave')
      next(leave)
    }
    next();
  },
  // async beforeRouteEnter(to, from, next) {
  //   const { docs } = await fireStore.getDocs<SongDoc>(
  //     "songs",
  //     where("uid", "==", fireAuth.currentUser().uid)
  //   );
  //   const songs = docs.map(document => {
  //     return { ...document.data(), docId: document.id };
  //   });
  //   console.log(songs);
  //   next(vue => {
  //     (vue as any).songs = songs;
  //   });
  // },
});
</script>

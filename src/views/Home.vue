<template>
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
          augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div v-if="songs" class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title " >Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem
          v-for="{ display_name, modified_name, comment_count, uid,docId } in songs"
          :song="{ docId,display_name, modified_name, comment_count }"
          :key="uid"
        >
        </SongItem>
      </ol>
      <!-- .. end Playlist -->
    </div>
    <div  v-show="!songs || pendingRequest " class="text-center mt-20 ">
      <SelfBuildingSquareSpinner  
      class="text-center  mx-auto"
      :animation-duration="1000"
      :size="100"
      :color="'black'" 
      />
      <p class="mt-5">
        Loading...
      </p>
    </div>
    <p v-if="isEnd" class="text-center mt-5 text-white bg-red-500 mb-4 py-4">
      You have reached at the end
    </p>
  </section>
</template>

<script lang="ts">
import { fireStore, limit, orderBy, QueryDocumentSnapshot, QuerySnapshot,Song, SongDoc, startAfter, startAt } from "@/includes/firebase/fireStore";
import { defineComponent } from "vue";
import SongItem from "@/components/Home/SongItem.vue";
import {SelfBuildingSquareSpinner } from "epic-spinners";

// @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    SongItem,
    SelfBuildingSquareSpinner:SelfBuildingSquareSpinner
  },
  data() {
    return {
      songs: null as Song[]|null,
      lastVisible:null as QueryDocumentSnapshot<SongDoc>|null,
      pendingRequest:false,
      isEnd:false
    };
  },
  async created() {
    await this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll(e: Event) {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if(this.pendingRequest || this.isEnd){
        return
      }
      this.pendingRequest = true
      let songsSnapshot:QuerySnapshot<SongDoc>
      if(!this.lastVisible){
        songsSnapshot = (await fireStore.getDocs<SongDoc>(
        "songs",
        orderBy('modified_name'),
        limit(3),
      ))
      }else{
        songsSnapshot = (await fireStore.getDocs<SongDoc>(
        "songs",
        orderBy('modified_name'),
        startAfter(this.lastVisible),
        limit(3),
      ))
      }
      console.log(songsSnapshot)
      const songs = songsSnapshot.docs.map(songDoc => {
        return { ...songDoc.data(),docId:songDoc.id };
      });
      const length = songsSnapshot.docs.length
      this.lastVisible = songsSnapshot.docs[length-1]
      this.songs?this.songs=[...this.songs,...songs]:this.songs=songs
      this.pendingRequest = false
      if(songs.length === 0){
        this.isEnd = true
      }
    },
  }
});
</script>

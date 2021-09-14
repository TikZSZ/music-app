<template lang="">
  <div v-if="sound" class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button">
          <i class="fa text-gray-500 text-xl" :class="{'fa-play':!isPlaying,'fa-pause':isPlaying}" @click.prevent="togglePlay"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left  h-7 leading-3 text-gray-400 text-lg w-14 ml-5 mt-2.5">
        <span class="player-currenttime">00:00</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div class="absolute md:left-0 md:right-0 text-lg text-center mx-auto player-song-info right-24 top-0 ">
          <span class="song-title">{{currentSong?.modified_name}}</span> by
          <span class="song-artist">{{currentSong?.display_name}}</span>
        </div>
        <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer">
          <span class="absolute top-neg-8 text-gray-800	text-lg" style="left: 50%;">
            <i class="fas fa-circle"></i>
          </span>
          <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            style="width: 50%;"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 text-lg  ml-8 mt-2.5">
        <span class="player-duration">03:06</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { State } from "@/store/State";
import { defineComponent } from "vue";
import { mapState,mapGetters } from "vuex";

export default defineComponent({
  name:'Player',
  computed:{
    ...mapGetters(['isPlaying']),
    ...mapState({
      currentSong: function (this,state:State){
        return state.currentSong
      },
      sound: function (this,state:State){
        return state.sound
      }  
    }) 
  },
  methods:{
    togglePlay(){
      if(this.isPlaying){
        this.sound?.pause()
        return
      }
      this.sound?.play()
    }
  }
})
//['currentSong','sound']
</script>

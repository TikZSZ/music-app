<template lang="">
  <div v-if="sound" class="fixed bottom-0 left-0 bg-white  text-left align-top w-full md:h-16 h-20">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 mt-9 ml-3 md:ml-4 md:mt-5 leading-3">
        <button type="button">
          <i class="fa text-gray-500 text-xl" :class="{'fa-play':!isPlaying,'fa-pause':isPlaying}" @click.prevent="togglePlay"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left  mt-11 ml-3  h-7 leading-3 text-gray-400 text-lg w-14 md:ml-4 md:mt-7">
        <span class="player-currenttime">{{seek}}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-22 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div class="absolute left-0 right-0 text-lg text-center mx-auto  top-0 ">
          <p class="song-title">{{currentSong?.modified_name}} (uploaded by {{currentSong?.display_name}})</p>
        </div>
        <!-- Scrub Container -->
        <span class="block w-full   h-2 rounded -ml-4 mt-10 md:mt-6 bg-gray-200 relative cursor-pointer"
          @click.prevent="updateSeek"
        >
          <!-- Player Ball -->
          <span class="absolute top-neg-8 text-gray-800	text-lg"  :style="{left:progress}">
            <i class="fas fa-circle"></i>
          </span>
           <!-- Player progress -->
          <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{width:progress}"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 text-lg  md:ml-1 md:mt-7  mt-11 ml-10">
        <span class="player-duration">{{duration}}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { State } from "@/store/State";
import { defineComponent } from "vue";
import { mapState,mapGetters,mapActions } from "vuex";

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
      },
      seek: function (this,state:State){
        return state.seek
      },
      duration: function (this,state:State){
        return state.duration
      },
      progress: function (this,state:State){
        return state.progress
      }
    }) 
  },
  methods:{
    ...mapActions(['togglePlay','updateSeek'])
  }
})
//['currentSong','sound']
</script>

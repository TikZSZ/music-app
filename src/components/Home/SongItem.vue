<template lang="html">
  <main
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
    duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink :to="{name:'Song',params:{id:song.docId}}"
        class="font-bold block text-gray-600">{{song.modified_name}}
      </RouterLink>
      <span class="text-gray-500 text-sm">{{song.display_name}}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link :custom="true" :to="{name:'Song',params:{id:song.docId},hash:'#comments'}"   v-slot="{navigate}">
        <span class="comments" @click.prevent="navigate()">
          <i class="fa fa-comments text-gray-600"></i>
          {{song.comment_count}}
        </span>
      </router-link>
    </div>
  </main>
</template>
<script lang="ts">
import { Song } from '@/includes/firebase/fireStore';
import { defineComponent, PropType } from 'vue'
import {mapActions} from "vuex"
// interface Song{
//   modified_name:string,
//   display_name:string,
//   comment_count:number,
//   docId:string
// }

export default defineComponent({
  name:"SongItem",
  props:{
    song:{
      type:Object as PropType<Song>,
      required:true
    }
  },
  methods:{
    ...mapActions(['newSong'])
  }
});
</script>

<template lang="html">
  <li
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
      <router-link :to="{name:'Song',params:{id:song.docId},hash:'#comments'}" class="comments" v-slot="{navigate}">
        <span @click.prevent="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{song.comment_count}}
        </span>
      </router-link>
    </div>
  </li>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Song{
  modified_name:string,
  display_name:string,
  comment_count:number,
  docId:string
}

export default defineComponent({
  name:"SongItem",
  props:{
    song:{
      type:Object as PropType<Song>,
      required:true
    }
  }
});
</script>

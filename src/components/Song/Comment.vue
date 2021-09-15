<template lang="html">
  <!-- Comment Author -->
  <main>
    <div class="mb-5">
      <div class="font-bold">{{ comment.name }}</div>
      <time>{{ new Date(comment.datePosted).toLocaleString() }}</time>
    </div>
    <p>
      {{ comment.comment }}
    </p>
    <div v-if="isLoggedIn && uid && uid === comment.uid">
      <hr />
      <button
        @click="deleteComment"
        class="py-1.5 my-2 px-3 rounded text-white bg-red-600 block"
        :disabled="delete_in_submission"
      >
        Delete
      </button>
    </div>
  </main>
</template>
<script lang="ts">
import { fireAuth } from "@/includes/firebase/fireAuth";
import { Comment, fireStore, increment } from "@/includes/firebase/fireStore";
import { defineComponent, PropType } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      delete_in_submission: false
    };
  },
  computed: {
    ...mapState(["isLoggedIn", "uid"])
  },
  emits: {
    removeComment: (index: number) => !!index
  },
  methods: {
    async deleteComment() {
      this.delete_in_submission = true;
      try {
        await fireStore.deleteDoc("comments", this.comment.commentId);
        fireStore.updateDoc("songs", { comment_count: increment(1) }, this.comment!.songId!);
        this.$emit("removeComment", this.index);
      } catch (err) {
        console.log(err.code);
      }
      this.delete_in_submission = false;
    }
  }
});
</script>

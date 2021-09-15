<template lang="html">
  <!-- Music Header -->
  <div v-if="song">
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 ml-5 md:ml-0 h-20 w-24 md:h-24 md:w-24  text-3xl bg-white text-black rounded-full
        focus:outline-none"
          @click.prevent="newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="md:text-3xl text-xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="comment_show_alert"
            :class="comment_alert_variant"
            class="fond-bold mb-4  text-white text-center py-4"
          >
            {{ comment_alert_msg }}
          </div>
          <VeeForm v-if="isLoggedIn" :validationSchema="commentSchema" @submit="addComment">
            <CustomFieldWrapper :field_name="'comment'" #default="{field_name}">
              <VeeField
                :name="field_name"
                as="textarea"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                placeholder="Your comment here..."
              ></VeeField>
            </CustomFieldWrapper>
            <button
              type="submit"
              class="py-1.5 my-2 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul id="comment" class="container mx-auto" v-if="comments.length > 0">
      <li
        v-for="(comment, index) in sortedComments"
        :key="index"
        class="p-6 bg-gray-50 border border-gray-200 mt-1"
      >
        <CommentComponent :comment="comment" :index="index" @removeComment="removeComment" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {
  CommentDoc,
  Comment,
  fireStore,
  Song,
  SongDoc,
  where,
increment
} from "@/includes/firebase/fireStore";
import { defineComponent } from "vue";
import CustomFieldWrapper from "@/components/CustomFieldWrapper.vue";
import { fireAuth } from "@/includes/firebase/fireAuth";
import { FormActions } from "vee-validate";
import { mapState,mapActions } from "vuex";
import CommentComponent from "@/components/Song/Comment.vue";

export default defineComponent({
  name: "SongComponent",
  components: {
    CustomFieldWrapper,
    CommentComponent
  },
  data() {
    return {
      song: null as Song | null,
      commentSchema: {
        comment: "required|min:3"
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_msg: "Please wait! Your comment is being submitted",
      showLoader: false,
      comments: [] as Comment[],
      sort: "1"
    };
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    sortedComments(): Comment[] {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted).getSeconds() - new Date(a.datePosted).getSeconds();
        }
        return new Date(a.datePosted).getSeconds() - new Date(b.datePosted).getSeconds();
      });
    }
  },
  async created() {
    const docId = this.$route.params.id as string;
    if (!docId) {
      return;
    }
    const song = await fireStore.getDoc<SongDoc>("songs", docId);

    if (!song.exists()) {
      this.$router.push({ name: "Home" });
      return;
    }
    this.song = { ...song.data(), docId: docId };
    const {sort} = this.$route.query
    if(!sort){
      this.$router.push({query:{sort:'1'}})
    }else{
      this.sort = sort as string
    }
    this.getComments(docId);
  },
  methods: {
    ...mapActions(['newSong']),
    async getComments(songId: string) {
      const commentsSnapshot = await fireStore.getDocs<CommentDoc>(
        "comments",
        where("songId", "==", songId)
      );
      const comments = commentsSnapshot.docs.map(commentDoc => {
        return { ...commentDoc.data(), commentId: commentDoc.id };
      });
      this.comments = comments;
    },
    async addComment(values: { comment: string }, ctx: FormActions<{ comment: string }>) {
      const { uid, displayName } = fireAuth.currentUser()!;

      (this.comment_alert_variant = "bg-blue-500"),
        (this.comment_alert_msg = "Please wait! Your comment is being submitted"),
        (this.comment_in_submission = true),
        (this.comment_show_alert = true);
      try {
        const commentData = {
          songId: this.song!.docId,
          comment: values.comment,
          datePosted: new Date().toString(),
          name: displayName!,
          uid: uid
        };
        const commentRef = await fireStore.addDoc<CommentDoc>("comments", commentData)
        fireStore.updateDoc("songs",{comment_count:increment(1)},this.song!.docId!)
        this.comments.unshift({ ...commentData, commentId: commentRef.id });
        this.song!.comment_count+=1
        ctx.resetForm();
      } catch (err) {
        console.log(err.code);
        this.handle_error_style();
        this.comment_alert_msg = "Oops something went wrong!";
        return;
      }
      this.handle_success_style();
    },
    removeComment(index: number) {
      this.comments.splice(index, 1);
    },
    handle_success_style() {
      (this.comment_alert_variant = "bg-green-500"),
        (this.comment_alert_msg = "Comment added"),
        (this.comment_show_alert = true);
      this.comment_in_submission = false;
      setTimeout(() => {
        this.comment_show_alert = false;
      }, 1000);
    },
    handle_error_style() {
      this.comment_alert_variant = "bg-red-500";
      this.comment_show_alert = true;
      this.comment_in_submission = false;
    }
  },
  watch:{
    sort(newOrder){
      console.log(newOrder)
      this.$router.push({query :{sort:newOrder}})
    }
  }
  
});
</script>
<style lang=""></style>

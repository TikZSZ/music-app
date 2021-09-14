<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 broder-green-400 border-solid': is_dragover }"
        @drag.prevent.stop
        @dragstart.prevent.stop
        @dragend.prevent.stop="is_dragover = true"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload" />
      <hr class="my-6" v-if="uploads.length > 1" />
      <!-- Progess Bars -->
      <div
        class="mb-4 my-1 text-center"
        v-for="({ current_progress, name, icon, variant, text_class, cancelable },
        index) of uploads"
        key="name"
      >
        <!-- File Name -->
        <div class="font-bold text-sm" :class="text_class">
          <i :class="icon"></i>
          {{ name }}
        </div>
        <div
          v-if="shouldShowProgressBar(text_class)"
          class="flex h-4 bg-gray-200 rounded-2xl"
          :class="variant"
        >
          <!-- Inner Progress Bar style="width: 75%"-->
          <div
            class="transition-all rounded-2xl progress-bar"
            current_progress
            :style="{ width: shouldShowProgressBar(text_class) ? current_progress + '%' : '0%' }"
          ></div>
        </div>
        <button
          v-if="cancelable"
          class="bg-red-600 py-1 px-5 my-1 rounded-xl text-white -mr-6 inline-block"
          @click.once="cancelUpload(index)"
        >Cancel</button>
      </div>
      <div v-if="miscError" class="bg-red-600 my-3 py-2 text-center mb-4 text-white rounded">
        <span class="mx-5">{{ miscError }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { fireStorage, UploadTask } from "@/includes/firebase/fireStorage";
import { fireAuth } from "@/includes/firebase/fireAuth";
import { fireStore, Song, SongDoc } from "@/includes/firebase/fireStore";
import { Firestore } from "firebase/firestore/lite";

interface Upload {
  task: UploadTask;
  current_progress: number;
  name: string;
  variant: string;
  icon: string;
  text_class: string;
  cancelable: boolean;
}

export default defineComponent({
  name: "Upload",
  data() {
    return {
      is_dragover: false,
      uploads: [] as Upload[],
      miscError: null as string | null
    };
  },
  methods: {
    shouldShowProgressBar(text_class: string) {
      if (text_class === 'text-red-400' || text_class === 'text-green-400') {
        return false
      }
      return true
    },
    async upload(e: DragEvent | any) {
      this.is_dragover = false;
      this.miscError = null;
      let files: File[] = [];

      if (e instanceof DragEvent && e.dataTransfer) {
        console.log("drag event");
        files = [...e.dataTransfer.files];
      } else if (e.target.files) {
        console.log("input event");
        files = [...((e.target as any).files as FileList)];
      } else {
        return;
      }

      files.map(async file => {
        if (file.type !== "audio/mpeg") {
          this.miscError = `${file.type} is not of type audio/mpeg`;
          return;
        }
        const task = fireStorage.uploadBytesResumable(`songs/${file.name}`, file);
        console.log("started");

        const uploadIndex =
          this.uploads.push({
            task: task,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
            cancelable: true
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            this.uploads[uploadIndex].current_progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (err) => {
            this.handle_error_style(uploadIndex);
            if (err.code === "storage/unauthorized") {
              this.miscError = `File size cannot exceed 10MB current file size is ${this.floorFigure(
                file.size / (1024 * 1024)
              )}MB`;
              return;
            }
            this.miscError = `Unexpected error occured while uploading the file please try again later`;
          },
          async () => {
            try {
              this.uploads[uploadIndex].cancelable = false;
              const songData = await this.uploadMetadata(task);
              this.$emit('addSong',songData)
            } catch (err: any) {
              console.log(err.code);
              this.miscError = "Something went wrong while uploading metadata pls contact us";
              fireStorage.deleteObject((await task).ref.fullPath)
              this.handle_error_style(uploadIndex);
              return;
            }
            this.handle_success_style(uploadIndex);
          }
        );
      });
    },

    async uploadMetadata(task: UploadTask) {
      const songData = {
        uid: fireAuth.auth.currentUser!.uid,
        display_name: fireAuth.auth.currentUser!.displayName || "",
        orginal_name: task.snapshot.ref.name,
        modified_name: task.snapshot.ref.name,
        genre: "",
        comment_count: 0,
        url: ""
      };
      songData.url = await fireStorage.getDownloadURLWithRef(task.snapshot.ref);
      const songRef = await fireStore.addDoc<SongDoc>("songs", songData)
      return {...songData,docId:songRef.id};
    },

    handle_error_style(uploadIndex: number) {
      this.uploads[uploadIndex].cancelable = false;
      this.uploads[uploadIndex].variant = "bg-red-400";
      this.uploads[uploadIndex].icon = "fas fa-times";
      this.uploads[uploadIndex].text_class = "text-red-400";
    },

    handle_success_style(uploadIndex: number) {
      this.uploads[uploadIndex].variant = "bg-green-400";
      this.uploads[uploadIndex].icon = "fas fa-check";
      this.uploads[uploadIndex].text_class = "text-green-400";
    },

    cancelUpload(uploadIndex: number) {
      this.uploads[uploadIndex].task.cancel();
      this.handle_error_style(uploadIndex);
    },

    cancelUploads() {
      console.log("i was called");
      this.uploads.map(upload => {
        upload.task.cancel();
      });
    },

    floorFigure(figure: number, decimals?: number) {
      if (!decimals) decimals = 2;
      const d = Math.pow(10, decimals);
      return ((figure * d) / d).toFixed(decimals);
    }
  },
  emits:{
    addSong:(song:Song)=> !!song
  }
});
</script>

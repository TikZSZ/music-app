import { FirebaseApp } from "@firebase/app"
import {FirebaseStorage,getStorage,uploadBytes,ref,uploadBytesResumable,listAll,list,ListOptions, getDownloadURL,StorageReference,deleteObject } from "firebase/storage"
import { firebaseApp } from "./firebaseApp"

import {UploadResult,UploadTask} from "firebase/storage"

class FireStorage {
  private storage:FirebaseStorage

  constructor(firebaseApp:FirebaseApp){
    this.storage = getStorage(firebaseApp)
  }

  uploadBytes(pathWithId:string,data: Blob | Uint8Array | ArrayBuffer){
    const storageRef = ref(this.storage,pathWithId)
    return uploadBytes(storageRef,data)
  }
  uploadBytesResumable(pathWithId:string,data: Blob | Uint8Array | ArrayBuffer){
    const storageRef = ref(this.storage,pathWithId)
    return uploadBytesResumable(storageRef,data)
  }
  listAll(pathWithId:string){
    const storageRef = ref(this.storage,pathWithId)
    return listAll(storageRef)
  }
  list(pathWithId:string,listOptions?:ListOptions){
    const storageRef = ref(this.storage,pathWithId)
    return list(storageRef,listOptions)
  }
  getDownloadURL(pathWithId:string){
    const storageRef = ref(this.storage,pathWithId)
    return getDownloadURL(storageRef)
  }
  getDownloadURLWithRef(storageRef:StorageReference){
    return getDownloadURL(storageRef)
  }
  deleteObject(pathWithId:string){
    const storageRef = ref(this.storage,pathWithId)
    return deleteObject(storageRef)
  }
}

export const fireStorage = new FireStorage(firebaseApp)

export {UploadResult,UploadTask}
import { Song } from "@/includes/firebase/fireStore";
import { Howl } from "howler";

export interface State{
  authModalShow:boolean,
  isMobile:boolean,
  isLoggedIn:boolean,
  userName:string|null,
  uid:string|null,
  currentSong:Song|null,
  sound:null|Howl,
  duration:string,
  seek:string,
  progress:string
}
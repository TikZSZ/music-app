import { RegistrationSchema } from "@/components/Auth/RegisterFormSchema";
import { UserDoc, fireStore, Song } from "@/includes/firebase/fireStore";
import { fireAuth, updateProfile } from "@/includes/firebase/fireAuth";
import {Howl} from "howler"
import { createStore } from "vuex";
import { State } from "./State";
import helper from "@/includes/helper";

export default createStore<State>({
  state: {
    authModalShow: false,
    isMobile: false,
    isLoggedIn: false,
    userName: null,
    uid: null,
    currentSong:null,
    sound:null,
    duration:'00:00',
    seek:'00:00',
    progress:'0%'


  },
  getters:{
    isPlaying:(state)=> {
      if(state.sound?.playing){
        return state.sound.playing()
      }
      return false
    }
  },
  mutations: {
    toggleAuthModal: state => (state.authModalShow = !state.authModalShow),
    toggleMobile: state => (state.isMobile = !state.isMobile),
    toggleAuth: state => (state.isLoggedIn = !state.isLoggedIn),
    setUserName: (state, name: string) => (state.userName = name),
    setUid: (state, uid: string) => (state.uid = uid),
    newSong:(state, song: Song) => {
      state.currentSong = song
      state.sound = new Howl({
        src:[song.url],
        html5:true
      })
    },
    updatePosition:(state)=>{
      state.seek = helper.formatTime(state.sound!.seek())
      state.duration = helper.formatTime(state.sound!.duration())
      state.progress = `${(state.sound!.seek()/state.sound!.duration())*100}%`
    }
  },
  actions: {
    async register({ commit,dispatch }, payload: RegistrationSchema) {
      const { email, password, name, age, country } = payload;
      // auth user
      const userCredentials = await fireAuth.createUserWithEmailAndPassword(email, password);
      console.log(userCredentials, "signed up");
      // get user
      const {user} = userCredentials

      // save display name
      const setDisplayName = updateProfile(userCredentials.user, {
        displayName: name
      });
      // get uuid of saved user
      const id = user.uid;
      // save information about user in fireStore
      const saveDoc = fireStore.setDoc<UserDoc>("users", { name, email, country, age }, id);
      await Promise.all([setDisplayName, saveDoc]);
      const doc = await fireStore.getDoc("users");
      // dispatch after login
      dispatch("afterLogin", { userName: user.displayName, uid: user.uid });
      commit('toggleAuthModal')

    },

    async login({ commit, dispatch }, payload: { email: string; password: string }) {
      const { email, password } = payload;

      const userCredentials = await fireAuth.signInWithEmailAndPassword(email, password);

      console.log(userCredentials, "signed in");
      const {user} = userCredentials
      dispatch("afterLogin", { userName: user.displayName, uid: user.uid });
      commit('toggleAuthModal')
    },

    async logOut({ commit }) {
      await fireAuth.signOut();
      commit("toggleAuth");
      commit("setUserName", "");
      // Avoid doing this router.push({name:'home})

      // avoid importing router as router also imports store it leads to dependency cycle
      // 1. pass on a callback function or
      // 2. the router object instead when calling the method or
      // 3. await the action and handle logic ur self in components
      // routing doesn't affect store data so better handle logic ur self in components

      // if(payload.route.meta.requiresAuth){
      //   payload.router.push({name:'home'})
      // }
    },

    init_login({ commit, dispatch }) {
      const user = fireAuth.auth.currentUser;
      if (user) {
        dispatch("afterLogin", { userName: user.displayName, uid: user.uid });
      }
    },

    afterLogin({ commit }, { uid, userName }: { userName: string; uid: string }) {
      commit("toggleAuth");
      commit("setUserName", userName);
      commit("setUid", uid);
    },

    newSong({ commit,state,dispatch }, payload: Song) {
      if(state.sound instanceof Howl){
        state.sound.unload();  
      }

      commit("newSong", payload);

      state.sound?.play()

      state.sound?.on('play', ()=>{
        requestAnimationFrame(()=>{
          dispatch('progress')
        })
      })
    },

    togglePlay({state}){
      if(!state.sound?.playing){
        return 
      }
      if(state.sound.playing()){
        state.sound.pause()
      }else{
        state.sound.play()
      }
    },

    progress({dispatch,commit,state}){
      commit('updatePosition')
      if(state.sound?.playing()){
        requestAnimationFrame(()=>{
          dispatch('progress')
        })
      }
    },

    updateSeek({state,dispatch},payload:any){
      if(!state.sound?.playing){
        return;
      };
      const {x,width} = payload.currentTarget.getBoundingClientRect()
      const clickX = payload.clientX-x;
      const percentage = clickX/width
      const seconds = state.sound.duration()*percentage
      state.sound.seek(seconds)
      state.sound.once('seek',()=>{
        dispatch('progress')
      })
    }
  }
});

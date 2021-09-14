import { RegistrationSchema } from "@/components/Auth/RegisterFormSchema";
import { UserDoc, fireStore, Song } from "@/includes/firebase/fireStore";
import { fireAuth, updateProfile } from "@/includes/firebase/fireAuth";
import {Howl} from "howler"
import { createStore } from "vuex";
import { State } from "./State";

export default createStore<State>({
  state: {
    authModalShow: false,
    isMobile: false,
    isLoggedIn: false,
    userName: null,
    uid: null,
    currentSong:null,
    sound:null
  },
  getters:{
    isPlaying:(state)=> {
      if(state.sound?.playing){
        return state.sound.playing()
      }
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
      state.sound?.unload()
      state.sound = new Howl({
        src:[song.url],
        html5:true
      })
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
    },

    async login({ commit, dispatch }, payload: { email: string; password: string }) {
      const { email, password } = payload;

      const userCredentials = await fireAuth.signInWithEmailAndPassword(email, password);

      console.log(userCredentials, "signed in");
      const {user} = userCredentials
      dispatch("afterLogin", { userName: user.displayName, uid: user.uid });
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

    newSong({ commit,state }, payload: Song) {
      commit("newSong", payload);
      state.sound?.play()
    }
  }
});

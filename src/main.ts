import { createApp,App as VueApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import validation from './includes/validation';
import {fireAuth} from "./includes/firebase/fireAuth"
import './assets/tailwind.css';
import "./assets/main.css"
import ProgressBar from "@/includes/progress-bar"
import 'nprogress/nprogress.css'
ProgressBar(router)
let app:VueApp<Element>|undefined = undefined

fireAuth.isUserLoggedIn(()=>{
  if(!app){
    app = createApp(App)
    app.use(store)
    app.use(router)
    app.use(validation)
    app.mount('#app');
  }
})



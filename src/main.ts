import { createApp,App as VueApp } from 'vue';
import App from './App.vue';
import router from './router';
import {iconDirective} from "@/directives/icon"
import store from './store';
import validation from './includes/plugins/validation';
import {fireAuth} from "./includes/firebase/fireAuth"
import './assets/tailwind.css';
import "./assets/main.css"
import ProgressBar from "@/includes/progress-bar"
import 'nprogress/nprogress.css'
import i18n from './i18n'

ProgressBar(router)

let app:VueApp<Element>|undefined = undefined

fireAuth.isUserLoggedIn(()=>{
  if(!app){
    app = createApp(App);
    
    app.use(i18n)
    app.use(store)
    app.use(router)
    app.use(validation)
    app.directive('icon',iconDirective)
    app.mount('#app');
  }
})



import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import store from './store'
import Toaster from '@meforma/vue-toaster'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"

let toastOptions = {
    position: 'top',
    timeout: 3000,
} 

//axios.defaults.baseURL = 'https://cloudcomputingapi.azurewebsites.net/'
axios.defaults.baseURL = import.meta.env.VITE_APP_CLOUD_COMPUTING_API;

const app = createApp(App)

const socketIO = new VueSocketIO({
    debug: true,
    //connection: SocketIO('https://cloudcomputingwebsockets.azurewebsites.net/'),
    connection: SocketIO(import.meta.env.VITE_APP_CLOUD_COMPUTING_WEBSOCKETS),
    /*
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    */
})

app.config.globalProperties.$axios = axios
app.use(router).use(store).use(Toaster, toastOptions).use(socketIO)
app.mount('#app')

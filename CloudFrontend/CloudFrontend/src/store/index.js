import { createStore } from 'vuex'
import axios from "axios";

export default createStore({
    state: {
        isAuth: localStorage.getItem("isAuth") || false,
        username: localStorage.getItem("username") || null,
        name: localStorage.getItem("name") || null
    },
    getters: {
        isAuth: state => state.isAuth,
        username: state => state.username,
        name: state => state.name
    },
    mutations: {
        mutationAuthOk(state, data) {
            state.isAuth = true
            state.username = data.username
            state.name = data.name

            axios.defaults.headers.common.Authorization = "Bearer " + data.token;
            localStorage.setItem("isAuth", true);
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("name", data.name);
        },
        mutationAuthReset(state) {
            state.isAuth = false
            state.username = null
            state.name = null

            delete axios.defaults.headers.common.Authorization;
            localStorage.removeItem("isAuth");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("name")
        }
    },

    actions: {
        login(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/login', {
                    username: credentials.username,
                    password: credentials.password
                })
                    .then(response => {
                        context.commit('mutationAuthOk', response.data.data)
                        resolve(response)
                    })
                    .catch(error => {
                        context.commit('mutationAuthReset')
                        reject(error)
                    })
            })
        },

        logout(context) {
                //console.log("LOGOUT")
                context.commit('mutationAuthReset')
        }
    },
})

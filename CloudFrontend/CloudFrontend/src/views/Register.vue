<template>
    <div class="container text-center" style="padding-top: 3rem;">

        <div class="row justify-content-md-center">
            <h1>Register</h1>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <label><b>Name:</b></label>
                <input type="text" placeholder="name" v-model="name" required />
            </div>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <label><b>Username:</b></label>
                <input type="text" placeholder="username" v-model="username" required />
            </div>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <label><b>Password:</b></label>
                <input type="password" placeholder="password" v-model="password" required />

                <div v-show="required != ''" class="text-danger">
                    {{ required }}
                </div>

                <div v-show="error != ''" class="text-danger">
                    {{ error }}
                </div>
            </div>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <button @click.prevent="signup">
                    Signup
                </button>
            </div>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <button @click.prevent="$router.push({ name: 'home' })" style="background-color: #b92b20">
                    Cancel
                </button>
            </div>
        </div>

    </div>
</template>

<script>

import axios from "axios";

export default {
    name: "signup",

    data() {
        return {
            username: "",
            password: "",
            name: "",
            required: "",
            error: "",
            config: {
                header: {
                    'Content-Type': 'application/json'
                }
            }
        };
    },

    methods: {
        signup() {

            if (!this.name) {
                this.error = ""
                this.error = "Required property 'name'"
                return;
            }

            if (!this.username) {
                this.error = ""
                this.error = "Required property 'username'"
                return;
            }

            if (!this.password) {
                this.error = ""
                this.error = "Required property 'password'"
                return;
            }

            axios.post("/signup", {
                username: this.username,
                password: this.password,
                name: this.name
            })
                .then(() => {
                    this.$store
                        .dispatch("login", {
                            username: this.username,
                            password: this.password,
                            name: this.name,
                        })
                        .then(() => {
                            this.$toast.success('User has register on the application.');

                            //this.$socket.emit('logged_in', this.username, this.$store.getters.userType)
                            this.$router.push({ name: "chat" });
                        })
                        .catch((error) => {
                            this.error = error.response.data.error;
                        });
                }).catch((error) => {
                    this.required = "";
                    this.error = error.response.data.error;
                });
        },
    },
};
</script>

<style scoped>
button {
    border-radius: 1rem;
    background-color: #04aa6d;
    color: white;
    padding: 0.5rem;
    margin-top: 2rem;
    border: none;
    cursor: pointer;
    width: 100%;
    font-size: 2rem;
}

button:hover {
    opacity: 0.8;
}

input[type="text"],
input[type="password"] {
    border-radius: 1rem;
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
</style>
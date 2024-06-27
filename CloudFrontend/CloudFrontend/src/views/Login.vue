<template>
    <div class="container text-center" style="padding-top: 1.5rem;">

        <div class="row justify-content-md-center">
            <h1>Login</h1>
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

                <div v-show="error.message != undefined" class="text-danger">
                    {{ error.message }}
                </div>
            </div>
        </div>

        <div class="row justify-content-md-center">
            <div class="col-md-5">
                <button @click.prevent="login">
                    Login
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

export default {
    name: "login",

    data() {
        return {
            username: localStorage.getItem("username") || "",
            password: "",
            required: "",
            error: "",
        };
    },

    mounted() {
        //console.log("ADDENTER")
        // Add event listener for keyup event on window
        window.addEventListener('keydown', this.handleKeyUp);
    },

    unmounted() {
        //console.log("DESTROY")
        // Remove event listener when component is destroyed
        window.removeEventListener('keydown', this.handleKeyUp);
    },

    methods: {
        login() {
            if (!this.username) {
                this.error = ""
                this.required = "Required property 'username'"
                return;
            }

            if (!this.password) {
                this.error = ""
                this.required = "Required property 'password'"
                return;
            }

            this.$store
                .dispatch("login", {
                    username: this.username,
                    password: this.password,
                })
                .then(() => {
                    this.$toast.success('User has logged on the application.');

                    //this.$socket.emit('logged_in', this.username, this.$store.getters.userType)
                    this.$router.push({ name: "chat" });
                })
                .catch((error) => {
                    this.required = "";
                    this.error = error.response.data.error;
                });
        },

        handleKeyUp(event) {
            // Check if Enter key was pressed
            if (event.key === 'Enter') {
                // Enter key was pressed, perform actions here
                //console.log('Enter key pressed on the page');
                this.login()
            }
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
    margin-top: 1.5rem;
    border: none;
    cursor: pointer;
    width: 100%;
    font-size: 2.5rem;
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
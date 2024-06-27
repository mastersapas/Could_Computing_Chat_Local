<template>
    <div class="container-fuild mx-4" style="padding-top: 1rem;">

        <div class="row">
            <div class="col" style="display: flex; justify-content: flex-start;">
                <h2 style="font-weight: bold; display: flex; align-items: center;">
                    {{ getName }}
                </h2>
            </div>
            <div class="col" style="margin-left: 35%;">
                <h1>Chat</h1>
            </div>
            <div class="col" style="display: flex; justify-content: flex-end; ">
                <button @click.prevent="exit" style="width: 50%; min-width: 60px;">
                    Exit
                </button>
            </div>
        </div>

        <div class="row">
            <div class="col-3" style="padding-right: 2%;">

                <div class="row">
                    <h2 style="font-weight: bold; display: flex; justify-content:center">
                        Files:
                    </h2>
                </div>

                <div class="row image" style="height:70.5vh; overflow:auto; ">
                    <div style="display: flex; flex-direction: column; overflow-x: hidden;">
                        <div v-for="(image, index) in images" :key="index">

                            <div class="dynamic-labelMy" style="border: none; font-weight: bold; text-align: center;">
                                <a :href=image.url target="_blank">
                                    <img :src="image.url" alt="Example Image" width="100%">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row" style="min-width: 135px; margin-top: 2%">
                    <form @submit.prevent="sendImage">
                        <input ref="fileInput" type="file" @change="handleFileUpload" />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>

            <div class="col-9">
                <div class="row chat" style="height:75vh; overflow:auto;">
                    <div style="display: flex; flex-direction: column-reverse; overflow-x: hidden;">
                        <div v-for="(message, index) in messages" :key="index">

                            <div class="dynamic-labelMy" v-if="message.type === 'M'"
                                style="margin-left: 55%; border: none; font-weight: bold;">
                                <label>{{ message.name }}</label>
                            </div>

                            <div class="dynamic-labelOther" v-else
                                style="margin-right: 55%; border: none; font-weight: bold;">
                                <label>{{ message.name }}</label>
                            </div>

                            <div class="dynamic-labelMy" v-if="message.type === 'M'" style="margin-left: 55%;">
                                <label>{{ message.msg }}</label>
                            </div>

                            <div class="dynamic-labelOther" v-else style="margin-right: 55%;">
                                <label>{{ message.msg }}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center align-items-end" style="height:10vh; margin-top: 1%;">
                    <div class="col-10">
                        <input type="text" placeholder="message" v-model="message" @keyup.enter="send" required />
                    </div>

                    <div class="col-2" style="min-width: 110px;">
                        <button @click.prevent="send">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "login",

    sockets: {
        connect: function () {
            //console.log('socket connected')
        },
        chat_message: function (data) {
            const message = this.tryParseJSON(data)

            if(message.name == "DELETE" && message.msg == "DELETE" && message.type == "DELETE"){
                console.log("DELETE");
                this.$router.go(0)
                return;
            }

            let messageOTHER = {
                name: message.name,
                msg: message.msg,
                type: message.type
            }

            this.messages.unshift(messageOTHER)
            this.scrollContainerToBottomChat();
        },
        image: function (data) {

            const image = this.tryParseJSON(data)

            let messageOTHER = {
                name: image.name,
                url: image.url,
            }

            this.images.unshift(image)
        }
    },

    data() {
        return {
            file: null,
            scrollValueChat: 0,
            firstScrollChat: true,
            scrollOfSetChat: 0,
            lastScrollHeigthChat: 0,
            message: "",
            messages: [],
            image: "",
            images: []
        };
    },

    mounted() {
        const chat = document.querySelector('.chat')

        chat.addEventListener('scroll', () => {
            this.scrollValue = chat.scrollTop;
            //console.log(chat.scrollTop + "scroll")
        });

        this.scrollOfSetChat = document.querySelector('.chat').scrollHeight;

        this.$nextTick(() => {
            this.scrollContainerToBottomChat();
        });

        axios.get("/message/last25")
            .then((messages) => {
                let msgArray = messages.data.data.value

                msgArray.forEach(element => {
                    if (element.username === this.$store.getters.username) {
                        element.type = "M"
                    } else {
                        element.type = "O"
                    }
                    this.messages.push(element)
                });
            }).then(() => {
                this.scrollContainerToBottomChat();
            })
            .catch((error) => {
                console.log(error)
            });

        axios.get(import.meta.env.VITE_APP_CLOUD_COMPUTING_STORAGE + "/images")
            .then((imagesData) => {

                if(imagesData.status !== 200){
                    this.$toast.error(imagesData.data);
                    return;
                }

                let imagesArray = imagesData.data

                imagesArray.forEach(element => {
                    this.images.push({
                        name: element,
                        url: import.meta.env.VITE_APP_CLOUD_COMPUTING_STORAGE + "/uploads/" + element + "?token=" + localStorage.getItem("token")

                    })
                });
            })
            .catch((error) => {
                console.log(error)
            })
    },

    computed: {
        getName() {
            return this.$store.getters.name;
        }
    },

    methods: {
        send() {
            if (this.message == "")
                return

            const messageMY = {
                name: this.$store.getters.name,
                msg: this.message,
                type: 'M',
            }

            this.messages.unshift(messageMY)

            this.scrollContainerToBottomChat();

            this.$socket.emit('chat_message', messageMY)

            axios.post("/message", {
                username: this.$store.getters.username,
                name: this.$store.getters.name,
                msg: this.message
            })
                .then(() => {

                }).catch((error) => {
                    this.required = "";
                    this.error = error.response.data.error;
                });
            this.message = ""
        },

        exit() {
            this.$store
                .dispatch("logout")
                .then(() => {
                    this.$toast.success("Success Logout");

                    //this.$socket.emit('logged_in', this.username, this.$store.getters.userType)
                    this.$router.push({ name: "home" });
                })
                .catch((error) => {
                    this.$toast.success("Error Logout");
                });
        },

        scrollContainerToBottomChat() {
            const container = document.querySelector('.chat');

            if (this.firstScrollChat && (container.scrollTop + this.scrollOfSetChat) != container.scrollHeight) {
                container.scrollTop = container.scrollHeight;
                this.firstScrollChat = false
            }

            if ((container.scrollTop + this.scrollOfSetChat) != container.scrollHeight) {
                container.scrollTop = container.scrollTop - (container.scrollHeight - this.lastScrollHeigthChat)
            }

            this.lastScrollHeigthChat = container.scrollHeight;
        },

        tryParseJSON(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                // Handle parsing error
                //console.error('Error parsing JSON:', error);
                return jsonString; // Return null or any other default value indicating failure
            }
        },

        handleFileUpload(event) {
            const regex = /^[a-zA-Z0-9\\.:_]+$/
            let filename = this.$refs.fileInput.value.replace(/ /g, "_")
            console.log(filename)
            
            if(!regex.test(filename)){
                this.$toast.error("File name contains special characters, rename before uploading!");
                this.$refs.fileInput.value = null;
                return;
            }

            //console(this.$refs.fileInput.value)
            //this.$refs.fileInput.value = 
            this.file = event.target.files[0];
        },

        sendImage() {
            if (!this.file) {
                this.$toast.success("Please select a file to upload");
                return;
            }

            let exit = false;

            this.images.forEach(image => {
                if (image.name === this.file.name.replace(/ /g, "_")) {
                    this.$toast.success("Image with the same name");
                    exit = true
                }
            })

            if (exit)
                return

            const formData = new FormData();
            formData.append('file', this.file);

            axios.post(import.meta.env.VITE_APP_CLOUD_COMPUTING_STORAGE + '/', formData, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                if (response.status !== 201) {
                    this.$toast.error("Failed to upload image");
                    return;
                }

                const image = {
                    name: this.file.name.replace(/ /g, "_"),
                    url: import.meta.env.VITE_APP_CLOUD_COMPUTING_STORAGE + "/uploads/" + this.file.name.replace(/ /g, "_") + "?token=" + localStorage.getItem("token")
                }

                this.images.unshift(image)

                this.$socket.emit('image', image)
                this.$toast.success('File uploaded successfully');
                this.$refs.fileInput.value = null;
            }).catch((error) => {
                console.log(error)
                this.required = "";
                this.error = error.response.data.error;
            });
        },
    },
};
</script>

<style scoped>
.image {
    background-color: #c3e7ff;
    border-radius: 1rem;
}

/* For browsers that support `scrollbar-*` properties */
@supports (scrollbar-color: auto) {
    .image {
        scrollbar-color: rgb(2, 202, 238) cornflowerblue;
    }
}

.chat {
    background-color: #c3e7ff;
    border-radius: 1rem;
}

/* For browsers that support `scrollbar-*` properties */
@supports (scrollbar-color: auto) {
    .chat {
        scrollbar-color: rgb(2, 202, 238) cornflowerblue;
    }
}

.dynamic-labelMy {
    border: 1px solid #4cd323;
    border-radius: 1rem;
    padding: 5px;
    margin-bottom: 10px;
    overflow-x: auto;
    /* Enable horizontal scroll if content exceeds the container's width */
    white-space: pre-wrap;
    text-align: start;
}

.dynamic-labelOther {
    border: 1px solid #595cec;
    border-radius: 1rem;
    padding: 5px;
    margin-bottom: 10px;
    overflow-x: auto;
    /* Enable horizontal scroll if content exceeds the container's width */
    white-space: pre-wrap;
    text-align: start;
}

input[type="text"] {
    border-radius: 1rem;
    width: 100%;
    margin: 8px;
    font-size: 1.9rem;
    border: 1px solid #ccc;
}

button {
    border-radius: 1rem;
    background-color: #369fe6;
    color: white;
    border: none;
    margin: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 2rem;
}

button:hover {
    opacity: 0.8;
}
</style>
<template>
  <RouterView />
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    if(localStorage.getItem("token")){
      axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
    }
  }
}
</script>

<style scoped></style>

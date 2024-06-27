<template>
  <div class="container text-center" style="padding-top: 1.5rem;">

    <div class="row justify-content-md-center">
      <div class="col-md-5">
        <img src="../assets/chat.png">
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-5">
        <button @click="$router.push({ name: 'login' })">
          Login
        </button>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-5">
        <button @click="$router.push({ name: 'register' })" style="background-color: #78a1e3">
          Signup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>

img {
  width: 75%
}

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
</style>

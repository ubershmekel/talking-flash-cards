<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  <h1>Talking Flash Cards</h1>
  <TeacherControls />
  <a href="https://github.com/ubershmekel/talking-flash-cards">source on github</a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
import TeacherControls from './components/TeacherControls.vue';
import './components/ShowJsErrors.vue';

export default defineComponent({
  name: 'App',
  components: {
    // HelloWorld,
    TeacherControls,
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

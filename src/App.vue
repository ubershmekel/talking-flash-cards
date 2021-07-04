<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  <h1>Talking Flash Cards</h1>
  <div v-if="urlParams.data">
    <a href="?">↖</a>
    <TeacherControls :dataUrl="urlParams.data" :initialIndex="+urlParams.i"/>
  </div>
  <div v-else>
    <ExampleMenu />
  </div>
  <footer>
    <a href="https://github.com/ubershmekel/talking-flash-cards"
      >source on github</a
    >
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import HelloWorld from './components/HelloWorld.vue';
import TeacherControls from "./components/TeacherControls.vue";
import ExampleMenu from "./components/ExampleMenu.vue";
import "./components/ShowJsErrors.vue";
import { urlGetParams } from "./teacher/browser";

export default defineComponent({
  name: "App",
  components: {
    // HelloWorld,
    ExampleMenu,
    TeacherControls,
  },
  data() {
    return {
      urlParams: urlGetParams(),
    };
  },
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

footer {
  margin: 2em;
  padding: 1em;
  border-top: #aaa 2px solid;
}
</style>

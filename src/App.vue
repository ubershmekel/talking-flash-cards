<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  <h1>Talking Flash Cards</h1>
  <div v-if="urlParams.data">
    <a href="?">↖</a>
    <TeacherControls :dataUrl="urlParams.data"/>
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

export default defineComponent({
  name: "App",
  components: {
    // HelloWorld,
    ExampleMenu,
    TeacherControls,
  },
  data() {
    return {
      urlParams: parseQuery(document.location.search),
    };
  },
});

function parseQuery(queryString: string) {
  // https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  var query: { [key: string]: string } = {};
  var pairs = (
    queryString[0] === "?" ? queryString.substr(1) : queryString
  ).split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return query;
}
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

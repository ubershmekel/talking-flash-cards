<template>
  <div class="menu">
    <div v-for="example in examplesData.examples" :key="example.title">
      <a :href="'?data=' + example.url">{{ example.title }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import examplesData from "../../public/examples/examples.json";
console.log("examplesData", examplesData);
export default defineComponent({
  name: "LessonsMenu",
  data() {
    return {
      examplesData,
    };
  },
  methods: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

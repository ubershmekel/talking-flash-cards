<template>
  <div class="controls">
    <h1>Controls</h1>
    <button v-on:click="speak">Speak</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFile } from '../teacher/jtxtReader';

export default defineComponent({
  name: 'TeacherControls',
  methods: {
    async speak() {
      getFile();
    }
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

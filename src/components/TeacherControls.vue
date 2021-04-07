<template>
  <div class="controls">
    <h1>Controls</h1>
    <button v-on:click="speak">Speak</button>
    <br />
    <button v-on:click="stop">Stop</button>
    <br />
    <input v-model="index">
    <br />
    <button v-on:click="prev">&lt;&lt;</button>
    <button v-on:click="next">&gt;&gt;</button>
    <br />
    <input class="slider" type="range" v-model.number="index" :min="indexMin" :max="indexMax">

    <div v-if="lesson">
      <div class="from">
        {{ lesson.pairs[index - 1][0] }}
      </div>
      <div class="to">
        {{ lesson.pairs[index - 1][1] }}
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFile, Lesson } from '../teacher/jtxtReader';
import * as talk from '../teacher/talk';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface ComponentData {
  index: number;
  indexMin: number;
  indexMax: number;
  lesson: Lesson | null;
  isPlaying: boolean;
}

const userHitStop = "userHitStop";

export default defineComponent({
  name: 'TeacherControls',
  computed: {

  },
  methods: {
    async speak(): Promise<void> {
      if (!this.$data.lesson) {
        talk.init();
        const lesson = await getFile();
        this.$data.lesson = lesson;
        this.$data.indexMax = lesson.pairs.length;
      }

      this.$data.isPlaying = true;
      this.play();
    },

    validateIndex() {
      if (!this.$data.lesson) {
        return;
      }
      if (this.$data.index > this.$data.lesson.pairs.length) {
        console.log("Wrapping around back to first line", this.$data.index, this.$data.lesson.pairs.length);
        this.$data.index = 1;
      }
      if (this.$data.index < 1) {
        console.log("Wrapping around back to first line", this.$data.index, this.$data.lesson.pairs.length);
        this.$data.index = this.$data.lesson.pairs.length;
      }

    },

    prev() {
      this.$data.index -= 1;
      this.validateIndex();
    },

    next() {
      this.$data.index += 1;
      this.validateIndex();
    },

    async playLine({texts, languages}: any) {
        // Read to teach.
        // One fast read
        // One slow read
        // One fast read
        await talk.speak({
          text: texts[0],
          lang: languages[0],
          rate: 1.0,
        });

        if (!this.$data.isPlaying) {
          throw userHitStop;
        }
        await sleep(200);

        await talk.speak({
          text: texts[1],
          lang: languages[1],
        });

        if (!this.$data.isPlaying) {
          throw userHitStop;
        }
        await sleep(200);

        await talk.speak({
          text: texts[0],
          lang: languages[0],
          rate: 0.4,
        });

        if (!this.$data.isPlaying) {
          throw userHitStop;
        }
        await sleep(200);

        await talk.speak({
          text: texts[0],
          lang: languages[0],
          rate: 1.0,
        });

        if (!this.$data.isPlaying) {
          throw userHitStop;
        }
        await sleep(1000);

        await talk.speak({
          text: texts[1],
          lang: languages[1],
        });

        if (!this.$data.isPlaying) {
          throw userHitStop;
        }
        await sleep(1000);
    },

    async play() {
      if (!this.$data.lesson) {
        console.error("playing an empty lesson");
        return;
      }

      while (this.$data.isPlaying) {

        await this.playLine({
          texts: this.$data.lesson.pairs[this.$data.index - 1],
          languages: this.$data.lesson.data.languages,
        });

        console.log("index played", this.$data.index);

        this.next();
      }
    },

    stop() {
      this.$data.isPlaying = false;
      talk.stopTalking();
    }
  },
  data() {
    return {
      index: 1,
      indexMin: 1,
      indexMax: 5,
      lesson: null,
    } as ComponentData;
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  margin: 1em;
}

button {
  margin: 1em;
}

.slider {
  display: inline-block;
}
</style>

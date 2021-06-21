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

interface ComponentData {
  index: number;
  indexMin: number;
  indexMax: number;
  lesson: Lesson | null;
  isPlaying: boolean;
}

// const userHitStop = "userHitStop";

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
      talk.stopTalking();
      this.$data.index -= 1;
      this.validateIndex();
    },

    next() {
      talk.stopTalking();
      this.$data.index += 1;
      this.validateIndex();
    },

    async play() {
      if (!this.$data.lesson) {
        console.error("playing an empty lesson");
        return;
      }

      const languages = this.$data.lesson.data.languages;
      while (this.$data.isPlaying) {

        const texts = this.$data.lesson.pairs[this.$data.index - 1];
        for (let sayJtxt of this.$data.lesson.data.say) {
          const lineIndex = sayJtxt["line"];
          const saySay = {
            lang: languages[lineIndex],
            text: texts[lineIndex],
            rate: sayJtxt.rate,
            pause: sayJtxt.pause,
          };
          talk.talkBufferPush(saySay);
        }

        const finished = await talk.talkBufferGo();
        // if (!finished) {
        //   // was cancelled for some reason
        //   // so stop.
        //   console.log("Stopping loop");
        //   return;
        // }

        console.log("index played", finished, this.$data.index);

        if (finished && this.isPlaying) {
          this.next();
        }
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

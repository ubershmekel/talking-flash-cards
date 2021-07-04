<template>
  <div class="controls">
    <h2 v-if="lesson && lesson.data">{{ lesson.data.title }}</h2>
    <div v-if="isPlaying">▶️</div>
    <div v-else>⏹</div>
    <button v-on:click="play">Play</button>
    <br />
    <button v-on:click="stop">Stop</button>
    <br />
    <input v-model="index">
    <br />
    <button v-on:click="prev">&lt;&lt;</button>
    <button v-on:click="next">&gt;&gt;</button>
    <br />
    <input class="slider" type="range" v-model.number="index" :min="indexMin" :max="indexMax" @change="onSliderSet">

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
import { getJsonTxtFile, Lesson } from '../teacher/jtxtReader';
import * as talk from '../teacher/talk';
import { replaceUrlParams } from '../teacher/browser';

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
      this.updateUrl();
    },

    next() {
      talk.stopTalking();
      this.$data.index += 1;
      this.validateIndex();
      this.updateUrl();
    },

    updateUrl() {
      replaceUrlParams({
        data: this.dataUrl,
        i: this.$data.index,
      });
    },

    onSliderSet() {
      console.log("onSliderSet", this.$data.index);
      talk.stopTalking();
      if (!this.dataUrl) {
        console.warn('messing with slider but got no data, odd...');
        return;
      }
      this.validateIndex();
      this.updateUrl();
    },

    async play() {

      if (this.$data.isPlaying) {
        console.log("play while playing");
        return;
      }

      if (!this.$data.lesson) {
        console.error("playing an empty lesson");
        return;
      }

      this.$data.isPlaying = true;
      const languages = this.$data.lesson.data.languages;
      while (this.$data.isPlaying) {
        const nowIndex = this.$data.index;

        const texts = this.$data.lesson.pairs[nowIndex - 1];
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

        // We want to avoid calling `next` after a seek
        if (nowIndex === this.$data.index && finished && this.isPlaying) {
          this.next();
        }
      }
    },

    stop() {
      this.$data.isPlaying = false;
      talk.stopTalking();
    }
  },
  async mounted() {
    if (!this.dataUrl) {
      console.error("No dataUrl", this.dataUrl);
      return;
    }
    const lesson = await getJsonTxtFile(this.dataUrl);
    this.$data.lesson = lesson;
    this.$data.indexMax = lesson.pairs.length;
    // We just got a real lesson with a max index, make sure the index from
    // the URL is valid.
    this.validateIndex();    
  },
  data() {
    console.log('initialIndex', this.initialIndex, this.index, this.$data.index);
    let index = 1;
    let indexMax = 5;
    if (this.initialIndex) {
      // For some reason, if the arbitrary indexMax is smaller than initialIndex,
      // the slider does not have a fresh indexMax and renders the knob in the
      // wrong position. So setting `indexMax` here.
      index = this.initialIndex;
      indexMax = index + 1;
    }
    return {
      indexMin: 1,
      index,
      indexMax,
      lesson: null,
      isPlaying: false,
    } as ComponentData;
  },
  props: {
    msg: String,
    dataUrl: String,
    initialIndex: Number,
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

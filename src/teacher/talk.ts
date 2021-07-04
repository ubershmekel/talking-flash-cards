const voiceMap: {[lang: string]: SpeechSynthesisVoice} = {};

let talkBuffer: Say[] = [];

async function waitForInit() {
  let attempts = 0;
  const intervalMs = 200;
  const maxAttempts = 20;
  while (Object.keys(voiceMap).length === 0) {
    attempts++;
    console.log("waitForInit must init");
    init();
    await sleep(intervalMs);
    if (attempts > maxAttempts) {
      console.error("Failed to load voices within ms:", intervalMs * maxAttempts);
      return;
    }
  }
}

function init() {
  const voices = window.speechSynthesis.getVoices();
  console.log('talk.init voices.length', voices.length);
  if (voices.length === 0) {
    console.error('No synth voices :(');
    return;
  }

  voices.sort((a, b) => {
    // ('' + a.lang).localeCompare(b.lang)
    if (a.localService) {
      // Make the localService show up earlier in the list so
      // later voices will overwrite them.
      // Because localService tend to have broken `onend` events that never happen.
      return -1;
    } else {
      return 1;
    }
  });

  for (let i = 0; i < voices.length; i++) {
    const voc = voices[i];
    // On Android Chrome, the language code has an underscore instead of a hyphen.
    // So we replace the underscore to make this app work everywhere.
    const vocCode = voc.lang.replace('_', '-');
    voiceMap[vocCode] = voc;
    // console.log('voc', voc);
  }
}

let wasCancelled = false;

export function stopTalking() {
  window.speechSynthesis.cancel();
  wasCancelled = true;
  talkBuffer = [];
}

interface Say {
  lang: string;
  text: string;
  rate: number;
  pause: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function talkBufferPush(phrase: Say) {
  talkBuffer.push(phrase);
}

// talkBufferGo returns `true` if it finished
// and returns `false` if it was cancelled.
export async function talkBufferGo(): Promise<boolean> {
  await waitForInit();
  wasCancelled = false;
  while (talkBuffer.length > 0) {
    const phrase: Say = talkBuffer.shift() as Say;
    await speak(phrase);
    if (wasCancelled) {
      return false;
    }
    console.log("talkBufferGo phrase.pause...");
    await sleep(phrase.pause * 1000);
  }
  return true;
}

let lastSpoken = new Date().getTime();

export async function speak({lang, text, rate}: Say) {
  const secondsSinceSpoken = (new Date().getTime() - lastSpoken) / 1000;
  if (secondsSinceSpoken < 0.1) {
    throw new Error("You're talking too fast");
  } else {
    lastSpoken = new Date().getTime();
  }
  if (Object.keys(voiceMap).length === 0) {
    console.error("Tried to speak but no voices found");
    init();
  }
  window.speechSynthesis.cancel();

  const utterThis = new SpeechSynthesisUtterance(text);
  // https://bugs.chromium.org/p/chromium/issues/detail?id=487255#c62
  // https://stackoverflow.com/questions/33889107/speech-synthesis-in-chrome-for-android-not-loading-voices
  if (!voiceMap[lang]) {
    console.warn("Tried to speak before voices were ready", voiceMap, lang, voiceMap[lang]);
    return;
  }
  utterThis.voice = voiceMap[lang];
  utterThis.lang = voiceMap[lang].lang;
  // utterThis.voiceURI = voiceMap[lang].voiceURI;
  if (rate) {
    utterThis.rate = rate;
  }
  console.log("speeaking", lang, text, utterThis.voice);
  window.speechSynthesis.speak(utterThis);
  return new Promise<void>((resolve, reject) => {
    utterThis.onend = (event) => {
      console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
      resolve();
    }
  
    utterThis.onerror = (event) => {
      console.log('utter error', event);
      reject(event);
    }
  });
}
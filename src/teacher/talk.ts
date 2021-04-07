const voiceMap: {[lang: string]: SpeechSynthesisVoice} = {};

export function init() {
  const voices = window.speechSynthesis.getVoices();
  console.log('voices loop', voices.length);
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
    voiceMap[voc.lang] = voc;
    // console.log('voc', voc);
  }
}

export function stopTalking() {
  window.speechSynthesis.cancel();
}

interface Say {
  lang: string;
  text: string;
  rate?: number;
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

  const utterThis = new window.SpeechSynthesisUtterance(text);
  utterThis.voice = voiceMap[lang];
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
const voiceMap: {[lang: string]: SpeechSynthesisVoice} = {};

export function init() {
  const voices = window.speechSynthesis.getVoices();
  console.log('voices loop', voices.length);
  if (voices.length === 0) {
    alert('No synth voices :(');
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

export function speak(langCode: string, text: string) {
  if (Object.keys(voiceMap).length === 0) {
    alert("Tried to speak but no voices found");
    init();
  }
  window.speechSynthesis.cancel();

  const utterThis = new window.SpeechSynthesisUtterance(text);
  utterThis.voice = voiceMap[langCode];
  console.log("speeaking", langCode, text, utterThis.voice);
  window.speechSynthesis.speak(utterThis);
  utterThis.onend = (event) => {
    console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
  }

  utterThis.onerror = (event) => {
    console.log('utter error', event);
  }
}
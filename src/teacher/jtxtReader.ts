export interface jtxtSay {
  line: number; // index of line (0 or 1)
  rate: number; // rate to speak (1.0 is neutral)
  pause: number; // seconds to wait after saying it
}

export interface LessonData {
  languages: string[];
  title: string;
  say: jtxtSay[];
}

export interface Lesson {
  data: LessonData;
  pairs: string[][];
}

export function parseJtxt(text: string): Lesson {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n/21896652
  const lines = text.split(/[\r\n]+/);
  let isJson = false;
  let jsonLines = [];
  let previousPhrase: string = '';
  const pairs: string[][] = [];
  let data: any = null;
  for (let i = 0; i < lines.length; i++) {
    const phrase = lines[i].trim();
    if ('<json>' === phrase) {
      jsonLines = [];
      isJson = true;
      continue;
    }
    if ('</json>' === phrase) {
      isJson = false;
      data = JSON.parse(jsonLines.join(''));
      continue;
    }
    if (isJson) {
      jsonLines.push(phrase);
      continue;
    }
    
    // Text pairs
    if (previousPhrase) {
      pairs.push([previousPhrase, phrase]);
      previousPhrase = '';
    } else {
      previousPhrase = phrase;
    }
  }
  return {
    data,
    pairs,
  }
}

export async function getFile() {
  const headers = new Headers();
  // headers.append(
  //   "Authorization",
  //   "api_key"
  // );
  const request = new Request(
    "examples/attack-on-titan-s1e1.json.txt",
    {
      method: "GET",
      headers,
      mode: "cors",
      cache: "default"
    }
  );
  const res = await fetch(request);
  const text = await res.text();
  const lesson = parseJtxt(text);
  console.log(lesson);
  return lesson;
}
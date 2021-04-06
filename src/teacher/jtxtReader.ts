interface Lesson {
  data: any;
  pairs: string[][];
}

export function parseJtxt(text: string) {
  const lines = text.split(/\r?\n/);
  let isJson = false;
  let bufferLines = [];
  let previousPhrase: string = '';
  const pairs: string[][] = [];
  let data: any = null;
  for (let i = 0; i < lines.length; i++) {
    const phrase = lines[i].trim();
    if ('<json>' === phrase) {
      bufferLines = [];
      isJson = true;
      continue;
    }
    if ('</json>' === phrase) {
      isJson = false;
      data = JSON.parse(bufferLines.join(''));
      continue;
    }
    if (isJson) {
      bufferLines.push(phrase);
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
    "/examples/attack-on-titan-s1e1.jtxt",
    {
      method: "GET",
      headers,
      mode: "cors",
      cache: "default"
    }
  );
  const res = await fetch(request);
  const text = await res.text();
  console.log(parseJtxt(text));
}
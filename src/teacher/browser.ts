function parseQuery(queryString: string) {
  // https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  const query: { [key: string]: string } = {};
  const pairs = (
    queryString[0] === "?" ? queryString.substr(1) : queryString
  ).split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return query;
}

export function urlGetParams() {
  return parseQuery(document.location.search);
}

export interface UrlParams {
  data: string; // url of json.txt file
  i: number; // index
}

export function replaceUrlParams(params: UrlParams) {
  // '?data=./examples/attack-on-titan-s1e1.json.txt&i=100'
  const queryString = `?data=${params.data}&i=${params.i}`;
  history.replaceState({}, '', queryString);
}
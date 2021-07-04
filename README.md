# talking-flash-cards

Learn by listening to the browser read out flash cards. [Try it out at talking-flash-cards.netlify.app](https://talking-flash-cards.netlify.app).

## Flash card data format

See the `public/examples` folder. The `.json.txt` file format starts with a JSON section, and then has pairs of lines with an empty line in between them. Each line can be in a different language.

## Create your own flash cards

* Create a `json.txt` file with the lesson content. You can copy the contents of [the Spanish lesson](https://raw.githubusercontent.com/ubershmekel/talking-flash-cards/main/public/examples/top-10-spanish-words.json.txt) to get started.
* Host your `.json.txt` file somewhere. An easy way to do that is create github repo, and upload the file to it.
* Once you have a link to your `.json.txt` file, use it at https://talking-flash-cards.netlify.app/?data=LINK_TO_YOUR_FILE
* If you're wondering what languages are available and their code name, check out https://ubershmekel.github.io/audio-language-tests/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

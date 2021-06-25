# talking-flash-cards

Learn by listening to the browser read out flash cards.

## Flash card data format

See the examples folder. The `.jtxt` file format starts with JSON section, and then has pairs of lines with an empty line in between them.

## To create your own flash cards

* Create a `json.txt` file that's hosted somewhere. An easy way to do that is create github repo, and create a file.
* Copy the contents of https://raw.githubusercontent.com/ubershmekel/talking-flash-cards/main/public/examples/attack-on-titan-s1e1.json.txt into a new file
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

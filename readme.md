# Training Game

This project is a small web app that helps you keep track of daily workout objectives. Each day has its own list of tasks defined in the JavaScript files. When you open `index.html`, the script picks objectives for today from the relevant file and saves your progress in your browser's local storage.

## How it works

1. Open `index.html` in a modern browser.
2. When prompted, enter your name to personalise the greeting.
3. Tick each objective as you complete it. Your progress and daily streak are saved automatically.
4. The side panels show yesterday's and tomorrow's plans so you can prepare.
5. A live countdown displays the time remaining until the next day.
6. Checked tasks reset automatically when a new day begins.

No server is required – everything runs entirely in the browser. The streak counter resets if you skip a day.

## Files

- `index.html` – main webpage
- `style.css` – layout and animations
- `script.js` – front-end logic
- `<weekday>.js` – arrays of training objectives

All code uses plain JavaScript modules. Feel free to customise the workout lists or expand the features.

## License

This project is released under the MIT License.

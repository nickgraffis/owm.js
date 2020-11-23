# 🌤️ Open Weather Map wrapper for javascript.

```javascript
const OpenWeather = require('owm.js');
let MyWeather = OpenWeather(MY_OPENWEATHER_APP_ID);

let losAngeles = MyWeather.location('Los Angeles');

let currentWeather = losAngeles.units('metric').lang('es').current().then(response => console.log(response));

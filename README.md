# 🌤️ Open Weather Map wrapper for javascript.

## Quick Demo:
```javascript
const OpenWeather = require('owm.js');
let MyWeather = OpenWeather(MY_OPENWEATHER_APP_ID);

let losAngeles = MyWeather.location('Los Angeles');

let currentWeather = losAngeles.units('metric').lang('es').current().then(response => console.log(response));
```
## Location:
You can establish a location with:
1. A city and/or state and/or country and/or zip code:
```javascript
MyWeather.location('Los Angeles'); //This is going to just use the city name in the query
MyWeather.locatino('Los Angeles', {state: 'ca', country: 'us'}); //This will use the city, state, country in the query
MyWeather.location('90807'); //Note that a zip code must be a string
```
2. Specific coordinates:
```javascript
MyWeather.location({lon: -118.24, lat: 34.05}); //This is going to just use the city name in the query
```

3. A city ID (list of OWM cities and their ids [here](https://openweathermap.org/api));
```javascript
MyWeather.location(5368361); //This will search for one city with an id of 5368361. Note this must be a number.
MyWeather.location([5368361, 5368378]); //This will search for a group of cities. Limit is 20. 
```
## Options
Check out the documentation for [Open Weather Map](https://openweathermap.org/api).

Once you have established a location

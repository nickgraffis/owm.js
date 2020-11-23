# 🌤️ Open Weather Map wrapper for javascript.
## The goal was to create a tool that was dead simple to use. And didn't do too much.

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
MyWeather.location('Los Angeles', {state: 'ca', country: 'us'}); //This will use the city, state, country in the query
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
Most options can be chained. Examples:
```javascript
MyWeather.location('Los Angeles')
.units('imperial')
.lang('es')
.timemachine(1606107304668)
.bbox(98, -119, 99, -90, 4);
.cnt(4)
.start(1606107304668)
.end(1606107304668)
.month(4)
.day(28)
.threshold(250)
.exclude('current');
```

Check out the documentation for [Open Weather Map](https://openweathermap.org/api) to see what options are avaliable with what calls.

## Callback function
Once you've established your location(s), your API Call and your options, you can chain callbacks.
```javascript
MyWeather.location('Los Angeles').units('imperial').current().then(r => console.log(r)).then(renderPage(r));
```
## API Calls
Check out the documentation for [Open Weather Map](https://openweathermap.org/api).

Once you have established a location, you can make one of the corresponding API calls:
* `current()` : [Current Weather Data](https://openweathermap.org/current).
⋅⋅* `current(zone)` can be used for showing cities within a zone. Call `MyWeather.currentWeatherOptions` for a list of options:
⋅⋅* box: API returns the data from cities within the defined rectangle specified by the geographic coordinates. You must add `MyWeather.bbox(lon-left, lat-bottom, lon-right, lat-top, zoom)` to your options to set the boundary.
⋅⋅* find: API returns data from cities laid within definite circle. You must use `MyWeather.location({lon: 199, lat: -190})` to establish longitude and latitude. Can use `MyWeather.cnt(3)` to establish that 3 cities are expected.
.⋅⋅* group: API returns a list of cities by ID. Must use `MyWeather.location([55475954, 58574489, 85759432])` when establishing your array of locations.
* `hourly4Days()` : [Hourly Forecast 4 Days](https://openweathermap.org/api/hourly-forecast).
* `oneCall()` : [One Call](https://openweathermap.org/api/one-call-api).
* `daily16Days()` : [Daily Forecast 16 days](https://openweathermap.org/forecast16).
* `climate30Days()` : [Climate Forecast 30 Days](https://openweathermap.org/api/forecast30).

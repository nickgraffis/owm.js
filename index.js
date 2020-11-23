const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const currentWeatherOptions = ['weather', 'box', 'find', 'group'];
const excludeOptions = ['current', 'minutely', 'hourly', 'daily', 'alerts'];
const statisticalOptions = ['month', 'day'];
const accumulatedOptions = ['temperature', 'precipitation'];
const supportedLang = [
  { af: 'Afrikaans' },  { al: 'Albanian' },
  { ar: 'Arabic' },     { az: 'Azerbaijani' },
  { bg: 'Bulgarian' },  { ca: 'Catalan' },
  { cz: 'Czech' },      { da: 'Danish' },
  { de: 'German' },     { el: 'Greek' },
  { en: 'English' },    { eu: 'Basque' },
  { fa: 'Persian' },    { fi: 'Finnish' },
  { fr: 'French' },     { gl: 'Galician' },
  { he: 'Hebrew' },     { hi: 'Hindi' },
  { hr: 'Croatian' },   { hu: 'Hungarian' },
  { id: 'Indonesian' }, { it: 'Italian' },
  { ja: 'Japanese' },   { kr: 'Korean' },
  { la: 'Latvian' },    { lt: 'Lithuanian' },
  { mk: 'Macedonian' }, { no: 'Norwegian' },
  { nl: 'Dutch' },      { pl: 'Polish' },
  { pt: 'Portuguese' }, { pt_br: 'Português' },
  { ro: 'Romanian' },   { ru: 'Russian' },
  { sv: 'Swedish' }, {se: 'Swedish'},
  { sk: 'Slovak' }, { sl: 'Slovenian' },
  { sp: 'Spainish' }, { es: 'Spainish'},
  { sr: 'Serbian' },    { th: 'Thai' },
  { tr: 'Turkish' },    { ua: 'Ukrainian' },
  { uk: 'Ukrainian' },
  { vi: 'Vietnamese' }, { zh_cn: 'Chinese Simplified' },
  { zh_tw: 'Chinese Traditional' }, { zu: 'Zulu' }
];
const unitOptions = ['standard', 'imperial', 'metric'];
const opOptions = [
  { Op: 'PAC0', meaning: 'Convective precipitation', units: 'mm' },
  { Op: 'PR0', meaning: 'Precipitation intensity', units: 'mm/s' },
  { Op: 'PA0', meaning: 'Accumulated precipitation', units: 'mm' },
  {
    Op: 'PAR0',
    meaning: 'Accumulated precipitation - rain',
    units: 'mm'
  },
  {
    Op: 'PAS0',
    meaning: 'Accumulated precipitation - snow',
    units: 'mm'
  },
  { Op: 'SD0', meaning: 'Depth of snow', units: 'm' },
  {
    Op: 'WS10',
    meaning: 'Wind speed at an altitude of 10 meters',
    units: 'm/s'
  },
  {
    Op: 'WND',
    meaning: 'Joint display of speed wind (color) and wind direction (arrows), received by U and V components',
    units: 'm/s'
  },
  {
    Op: 'APM',
    meaning: 'Atmospheric pressure on mean sea level',
    units: 'hPa'
  },
  {
    Op: 'TA2',
    meaning: 'Air temperature at a height of 2 meters',
    units: '°C'
  },
  { Op: 'TD2', meaning: 'Temperature of a dew point', units: '°C' },
  { Op: 'TS0', meaning: 'Soil temperature 0-10 сm', units: 'K' },
  { Op: 'TS10', meaning: 'Soil temperature >10 сm', units: 'K' },
  { Op: 'HRD0', meaning: 'Relative humidity', units: '%' },
  { Op: 'CL', meaning: 'Cloudiness', units: '%' }
]

function njax(url, method, callback, headers, body) {
  let xhttp = new XMLHttpRequest();
  if (headers) {
    headers.forEach(h => xhttp.setRequestHeader(h.header, h.value));
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(xhttp.responseText));
    } else if (this.readyState == 4 && this.status != 200) {
      callback(JSON.parse(xhttp.responseText));
    }
  };
  xhttp.open(method, url, true);
  xhttp.send(body);
}

class OpenWeather {
  constructor (OPENWEATHER_APP_ID, version = 2.5) {
    this.weatherApiKey = OPENWEATHER_APP_ID;
    this.type;
    this.longitude;
    this.latitude;
    this.city;
    this.country;
    this.state;
    this.zip;
    this.ids;
    this.version = version;
    this.subdomain = 'api';
    this.base = `https://${this.subdomain}.openweathermap.org/data/${this.version}/`;
    this.url;
    this.method = 'GET';
    this.headers = null;
    this.body = null;
    this.call;
    this.options = [];
    this.error = null;
  }

  get excludeOptions () {
    return excludeOptions;
  }

  get currentWeatherOptions () {
    return currentWeatherOptions;
  }

  get statisticalOptions () {
    return statisticalOptions;
  }

  get accumulatedOptions () {
    return accumulatedOptions;
  }

  get supportedLang () {
    return supportedLang;
  }

  get opOptions () {
    return opOptions;
  }

  get unitOptions () {
    return unitOptions;
  }

  location (place, options = {state: null, country: null}) {
    if (typeof place === 'object') {
      this.type = place[0] ? 'ids' : 'coordinates';
      this.longitude = place[0] ? null :  place.lon;
      this.latitude = place[0] ? null : place.lat;
      this.ids = place[0] ? place : null;
    } else if (typeof place === 'number') {
      this.type = 'ids';
      this.ids = [place];
    } else {
      this.type = 'string';
      this.city = isNaN(parseInt(place)) ? place : null;
      this.zip = isNaN(parseInt(place)) ? null : parseInt(place);
      this.state = options.state;
      this.country = options.country;
    }
    return this;
  }

  locationString () {
    if (this.type === 'string') {
      return `${this.city ? 'q=' + this.city : ''}${this.zip ? 'zip=' + this.zip : ''}${this.state ? ',' + this.state : ''}${this.country ? ',' + this.country : ''}`;
    } else if (this.type === 'ids') {
      if (this.ids.length > 1) {
        return `id=${this.ids.slice(0, -1).join(',') + ',' + this.ids.slice(-1)}`;
      } else {
        return `id=${this.ids[0]}`;
      }
    } else {
      return `lat=${this.latitude}&lon=${this.longitude}`;
    }
  }

  urlString () {
    if (this.ids && this.ids.length > 1) {
      this.call = 'group';
    }

    let options = this.options.map(opt => `&${Object.keys(opt)}=${opt[Object.keys(opt)]}`).join('');
    this.url = `${this.base}${this.call}?${this.locationString()}${options}&appid=${this.weatherApiKey}`;

    return this.url;
  }

  units (units) {
    if (unitOptions.includes(units)) {
      this.options.push({units});
    } else {
      return 'Error';
    }

    return this;
  }

  lang (lang) {
    if (supportedLang.map(sl => Object.keys(sl).join('')).includes(lang)) {
      this.options.push({lang});
    } else {
      return 'Error';
    }

    return this;
  }

  bbox (lonLeft, latBottom, lonRight, latTop, zoom) {
    this.options.push({bbox: `${lonLeft}, ${latBottom}, ${lonRight}, ${latTop}, ${zoom}`});

    return this;
  }

  cnt (cnt) {
    this.options.push({cnt});

    return this;
  }

  start (start) {
    this.options.push({start});

    return this;
  }

  end (end) {
    this.options.push({end});

    return this;
  }

  month (month) {
    if (month.match(/[1-9]|1[0-2]/)) {
      this.options.push({month});
    } else {
      return 'Error';
    }

    return this;
  }

  day (day) {
    if (day.match(/[1-9]|1[0-9]|2[0-9]|3[0-1]/)) {
      this.options.push({day});
    } else {
      return 'Error';
    }

    return this;
  }

  threshold (threshold) {
    this.options.push({threshold});

    return this;
  }

  exclude (option) {
    if (excludeOptions.includes(option)) {
      this.options.push({exclude: option});
    } else {
      return 'Error';
    }

    return this;
  }

  timemachine (dt) {
    if (dt > (Math.floor((new Date()).getTime() / 1000) - (86400 * 5))) {
      this.call += '/timemachine';
      this.options.push({dt});
    } else {
      this.error = 'You can only go back a max of 5 days with the One Call Timemachine.';
    }

    return this;
  }

  current (zone = 'weather') {
    if (currentWeatherOptions.includes(zone)) {
      this.call = zone;
    } else {
      this.error = 'This is not an option for current weather. Check out this.currentWeatherOptions for avaliable options.';
    }

    return this;
  }

  hourly4Days () {
    this.call = 'forcast/hourly';

    return this;
  }

  oneCall () {
    this.call = 'onecall';

    if (!this.longitude || !this.latitude) {
      this.error =  "One Call requires a location specificed in coordinates!";
    }

    return this;
  }

  daily16Days () {
    this.call = 'forcast/daily';

    return this;
  }

  climate30Days () {
    this.call = 'forcast/climate';

    return this;
  }

  bulk () {

  }

  roadRisk (array) {
    this.method = 'POST';
    this.call = 'roadrisk';
    this.body = JSON.stringify(array);
    this.headers = [{'Content-Type': 'application/json'}]

    return this;
  }

  fiveDay3Hour () {
    this.call = 'forcast';

    return this;
  }

  historical () {
    this.subdomain = 'history';
    this.call = 'history/city';
    this.options.push({type: 'hour'});

    return this;
  }

  statistical (type = null) {
    if (type && statisticalOptions.includes(type)) {
      this.call = 'aggregated/' + type;
    } else {
      this.call = 'aggregated';
    }

    this.subdomain = 'history';

    return this;
  }

  accumulated (type) {
    this.subdomain = 'history';

    if (accumulatedOptions.includes(type)) {
      this.call = '/history/accumulated_' + type;
    }
  }

  historyBulk () {

  }

  historicalByStateAllZipCodes () {

  }

  historicalForcasts () {

  }

  weatherMaps2 (op, z, x, y) {

  }

  globalPrecipitationMap () {

  }

  reliefMap () {

  }

  weatherMaps1 () {

  }

  weatherStations () {

  }

  weatherTriggers () {

  }

  uvIndex (type = null) {
    if (type === null || type === 'forcast' || type === 'history') {
      this.call = type ? 'uvi' : 'uvi/' + type;
    } else {
      return 'Error';
    }

    return this;
  }

  then (callback) {
    if (this.error) {
      return callback(this.error);
    } else {
      njax(this.urlString(), this.method, callback, this.headers, this.body);
    }

    return this;
  }
}

module.exports = OpenWeather;

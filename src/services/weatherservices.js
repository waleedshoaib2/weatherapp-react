import { DateTime } from "luxon";

const API_KEY = "c10bb32605fcffdb749b72192b0713aa";
let BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric
// Define a function named getWeatherData that takes two arguments: infoType and searchParams
const getWeatherData = (infoType, searchParams) => {
  if (infoType === "onecall") {
    BASE_URL = "https://api.openweathermap.org/data/3.0";
  }

  if (infoType === "weather") {
    BASE_URL = "https://api.openweathermap.org/data/2.5";
  }
  // Create a new URL object by concatenating the BASE_URL, a forward slash, and the infoType argument
  const url = new URL(BASE_URL + "/" + infoType);
  // Set the search parameters of the URL using the searchParams argument, with the addition of an appid parameter set to the value of the API_KEY
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  // Use the fetch function to make a request to the constructed URL
  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  // Use destructuring assignment to extract values from the data object and assign them to local variables
  const {
    coord: { lat, lon }, // Extract the lat and lon properties of the coord object
    main: { temp, feels_like, temp_min, temp_max, humidity }, // Extract the temp, feels_like, temp_min, temp_max, and humidity properties of the main object
    name, // Extract the name property
    dt, // Extract the dt property
    sys: { country, sunrise, sunset }, // Extract the country, sunrise, and sunset properties of the sys object
    weather, // Extract the weather property (an array)
    wind: { speed }, // Extract the speed property of the wind object
  } = data;

  // Destructure the first element of the weather array to extract its main and icon properties
  const { main: details, icon } = weather[0];

  // Return a new object containing the extracted values as properties
  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  let { timezone, daily, hourly } = data;

  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  // Repeat the same process for the hourly array, except that different arguments are used when calling the formatToLocalTime function and different properties are accessed when constructing the new object
  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  // Return a new object containing three properties: timezone, daily, and hourly
  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };

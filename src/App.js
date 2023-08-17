import "./App.css";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import TimeandLocation from "./components/TimeandLocation";
import Details from "./components/Details";
import Forecast from "./components/Forecast";
import { useState, useEffect } from "react";
import getWeatherData from "./services/weatherservices";
import getFormattedWeatherData from "./services/weatherservices";
// import UilReact from "@iconscout/react-unicons/icons/uil-react";

function App() {
  const [query, setQuery] = useState({ q: "lahore" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getFormattedWeatherData({ ...query, units }).then(
        (data) => {
          setWeather(data);
        }
      );
      console.log(data);
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-green-500 to-blue-700";

    return "from-orange-700 to-red-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-lg mt-2 py-5 px-32 bg-gradient-to-b  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <Header setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          <TimeandLocation weather={weather} />
          <Details weather={weather} />
          <Forecast title="Hourly Forecast" items={weather.hourly} />
          <Forecast title="Daily Forecast" items={weather.daily} />
        </div>
      )}
    </div>
  );
}

export default App;

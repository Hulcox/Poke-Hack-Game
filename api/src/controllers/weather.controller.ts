import type { Context } from "hono";
import { getWeather, saveWeather } from "../services/weather.service.js";
import {
  ERROR_INTERNAL_SERVER,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../utils/constants.js";

const API_WEATHER_KEY = process.env.API_WEATHER_KEY || "";
const API_WEATHER_URL = process.env.API_WEATHER_URL || "";

const CACHE_EXPIRY = 60 * 10; //10min

export class WeatherController {
  static getWeather = async (c: Context) => {
    try {
      const lat = c.req.query("lat");
      const lon = c.req.query("lon");

      if (!lat || !lon) {
        return c.json(
          { error: "Lat and lon required" },
          STATUS_CODE_BAD_REQUEST
        );
      }

      console.log(lat, lon);

      const cacheWeather = await getWeather(lat, lon);
      if (cacheWeather) {
        console.log("Météo chargée depuis Redis");
        return c.json(cacheWeather);
      }

      const response = await fetch(
        `${API_WEATHER_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_WEATHER_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Error OpenWeather API");
      }

      const weatherData = await response.json();
      await saveWeather(lat, lon, weatherData, CACHE_EXPIRY);

      console.log("Météo récupérer par OpenWeather");
      return c.json(weatherData);
    } catch (error) {
      console.log("Error :", error);
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };
}

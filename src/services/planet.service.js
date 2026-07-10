import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PLANET_API_KEY = process.env.PLANET_API_KEY;

export const planetApi = axios.create({
  baseURL: "https://api.planet.com",
  timeout: 30000,
  auth: {
    username: PLANET_API_KEY,
    password: ""
  },
  headers: {
    "Content-Type":
      "application/json"
  }
});

import axios from "axios";

const API_URL = "http://localhost:3100"; // 🔹 Cambia esto si el backend está en otro puerto o dominio

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

import axios from "axios";
import { SERVER_ENDPOINT } from "@/global/projectConfig";

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: SERVER_ENDPOINT,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};

export const baseAPI = axiosInstance();

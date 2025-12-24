import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const expressApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_EXPRESS_BASE_URL || "http://localhost:3003/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const elysiaApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_ELYSIA_BASE_URL || "http://localhost:3002/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const fastApi = axios.create({
  // Default to service name inside docker network
  baseURL: process.env.NEXT_PUBLIC_FAST_API_BASE_URL || "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
elysiaApi.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { api, fastApi, elysiaApi, expressApi };

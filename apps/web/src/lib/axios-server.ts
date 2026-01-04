import axios from "axios";
import { authOptions } from "./auth";
import { getServerSession } from "next-auth/next";

const expressApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXPRESS_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const elysiaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ELYSIA_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const fastApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FAST_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
elysiaApi.interceptors.request.use(
  async (config) => {
    try {
      const session = await getServerSession(authOptions);
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

export { fastApi, elysiaApi, expressApi };

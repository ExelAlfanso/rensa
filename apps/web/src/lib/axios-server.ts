import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

const expressApi = axios.create({
	baseURL: process.env.EXPRESS_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});
const elysiaApi = axios.create({
	baseURL: process.env.ELYSIA_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const fastApi = axios.create({
	baseURL: process.env.FAST_API_BASE_URL,
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
	(error) => Promise.reject(error)
);

export { elysiaApi, expressApi, fastApi };

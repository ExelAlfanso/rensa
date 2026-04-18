import axios from "axios";

// Ensure axios has an absolute base URL during SSR/tests where relative URLs break URL parsing
const baseURL =
	typeof window === "undefined"
		? process.env.NEXT_PUBLIC_APP_URL
			? `${process.env.NEXT_PUBLIC_APP_URL}/api`
			: "http://localhost:3000/api"
		: "/api";

const api = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export { api };

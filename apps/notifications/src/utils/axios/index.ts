import axios from "axios";

const api = axios.create({
	// Default to the frontend service name inside docker network
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export { api };

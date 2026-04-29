import { api } from "@/lib/axios-client";

export const uploadFormData = async (formData: FormData) => {
	const res = await api.post("/photos/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return res.data.data;
};

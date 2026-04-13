import { createSwaggerSpec } from "next-swagger-doc";
import { openApiSpec } from "@/backend/shared/openapi/spec";

export const getApiDocs = async () => {
	const definition = openApiSpec as unknown as NonNullable<
		Parameters<typeof createSwaggerSpec>[0]
	>["definition"];

	const spec = createSwaggerSpec({
		apiFolder: "app/api",
		definition,
	});
	return spec;
};

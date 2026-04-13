"use client";

import { useEffect } from "react";

declare global {
	interface Window {
		SwaggerUIBundle?: (config: {
			dom_id: string;
			presets?: unknown[];
			url: string;
		}) => unknown;
		SwaggerUIStandalonePreset?: unknown;
	}
}

const SWAGGER_CSS_URL =
	"https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";
const SWAGGER_BUNDLE_URL =
	"https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";
const SWAGGER_STANDALONE_URL =
	"https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js";

const injectCss = (href: string) => {
	if (document.querySelector(`link[href="${href}"]`)) {
		return;
	}
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
};

const injectScript = (src: string): Promise<void> =>
	new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve();
			return;
		}
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
		document.body.appendChild(script);
	});

export default function SwaggerClient() {
	useEffect(() => {
		let cancelled = false;
		injectCss(SWAGGER_CSS_URL);
		const initSwagger = async () => {
			await injectScript(SWAGGER_BUNDLE_URL);
			await injectScript(SWAGGER_STANDALONE_URL);

			if (cancelled || !window.SwaggerUIBundle) {
				return;
			}

			const presets = window.SwaggerUIStandalonePreset
				? [window.SwaggerUIStandalonePreset]
				: [];

			window.SwaggerUIBundle({
				url: "/api/openapi",
				dom_id: "#swagger-ui",
				presets,
			});
		};

		initSwagger().catch(() => undefined);

		return () => {
			cancelled = true;
		};
	}, []);

	return <div className="min-h-screen bg-white" id="swagger-ui" />;
}

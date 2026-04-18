import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
	...tailwindCanonicalClasses.configs["flat/recommended"],
	{
		rules: {
			"tailwind-canonical-classes/tailwind-canonical-classes": [
				"warn",
				{
					cssPath: "./src/app/globals.css",
				},
			],
		},
	},
];

export default eslintConfig;

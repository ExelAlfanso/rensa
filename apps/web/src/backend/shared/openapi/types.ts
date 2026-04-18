export interface OpenApiFragment {
	components?: {
		schemas?: Record<string, unknown>;
		examples?: Record<string, unknown>;
	};
	paths?: Record<string, Record<string, unknown>>;
	tags?: Array<{ name: string; description?: string }>;
}

export function detectValueinString(keys: string[], str: string) {
	try {
		for (const key of keys) {
			if (str.toLowerCase().includes(key.toLowerCase())) {
				// console.log(`Detected ${key} in ${str}`);
				return key;
			}
		}
	} catch (e) {
		console.error("Error in detectValueinString:", e);
	}

	return null;
}

const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
const CAMERA_MODEL_PATTERN =
	/\b([A-Za-z]+(?:\s[A-Za-z0-9]+)*\s\d+[A-Za-z0-9]*(?:\sMark\s[IVX]+)?)\b/;

export function extractNumberFromString(str: string) {
	const match = str.match(NUMBER_PATTERN);
	return match ? Number.parseFloat(match[0]) : null;
}

export function extractModelFromString(str: string) {
	const match = str.match(CAMERA_MODEL_PATTERN);
	return match ? match[1] : null;
}

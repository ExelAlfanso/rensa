const LEADING_CHARACTER_PATTERN = /^./;
const UPPERCASE_LETTER_PATTERN = /([A-Z])/g;

export function formatLabel(key: string): string {
	return key
		.replace(UPPERCASE_LETTER_PATTERN, " $1")
		.replace(LEADING_CHARACTER_PATTERN, (str) => str.toUpperCase());
}

export function formatLabelFirstLetter(key: string): string {
	const lowerCasedKey = key.toLowerCase();
	return lowerCasedKey.charAt(0).toUpperCase() + lowerCasedKey.slice(1);
}

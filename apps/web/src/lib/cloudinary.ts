import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

/**
 * 🔒 SECURITY: Validate Cloudinary URL integrity
 * Ensures the URL is from a trusted Cloudinary domain and uses HTTPS
 */
export function validateCloudinaryUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);

		// ✅ Must use HTTPS
		if (parsedUrl.protocol !== "https:") {
			console.error("❌ URL validation failed: Not HTTPS");
			return false;
		}

		// ✅ Must be from Cloudinary domain
		const allowedDomains = ["res.cloudinary.com", "cloudinary.com"];

		const isValidDomain = allowedDomains.some(
			(domain) =>
				parsedUrl.hostname === domain ||
				parsedUrl.hostname.endsWith(`.${domain}`)
		);

		if (!isValidDomain) {
			console.error("❌ URL validation failed: Not from Cloudinary domain");
			return false;
		}

		// ✅ Must contain the cloud name to prevent cross-account attacks
		const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
		if (cloudName && !url.includes(`/${cloudName}/`)) {
			console.error("❌ URL validation failed: Wrong cloud name");
			return false;
		}

		return true;
	} catch (error) {
		console.error("❌ URL validation failed: Invalid URL format", error);
		return false;
	}
}

export default cloudinary;


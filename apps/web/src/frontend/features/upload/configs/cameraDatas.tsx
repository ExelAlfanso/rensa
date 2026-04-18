// TODO: probably make dashboard for adding and removing presets, also make it possible to add custom presets

// helpers
export type Range<_N extends number> = number; // just for readability
export type OnOff = "On" | "Off";
export type Strength = "Off" | "Weak" | "Strong";
export type WBMode =
	| "Auto"
	| "Custom"
	| "Manual"
	| "Kelvin"
	| "Daylight"
	| "Shade"
	| "Cloudy"
	| "Tungsten"
	| "Fluorescent"
	| "Flash";

// ================= Fujifilm =================
export interface FujifilmSettings {
	Brand: "Fujifilm";
	Clarity?: Range<-5 | 5>;
	Color?: Range<-4 | 4>;
	ColorChromeEffect?: "Off" | "Strong" | "Weak";
	ColorChromeFXBlue?: "Off" | "Strong" | "Weak";
	DynamicRange?: "DR100" | "DR200" | "DR400" | "Auto";
	FilmMode: "Provia" | "Velvia" | "Classic Chrome" | "Acros" | string;
	GrainEffect?:
		| "Off"
		| "Weak-Small"
		| "Weak-Large"
		| "Strong-Small"
		| "Strong-Large";
	HighlightTone?: Range<-2 | 4>;
	ISO?: number | "Auto";
	Model: string;
	NoiseReduction?: Range<-4 | 4>;
	ShadowTone?: Range<-2 | 4>;
	Sharpness?: Range<-4 | 4>;
	WhiteBalance?: WBMode;
}

// ================= Sony =================
export interface SonySettings {
	Brand: "Sony";
	Clarity?: Range<0 | 9>;
	Contrast?: Range<-9 | 9>;
	CreativeLook?: "ST" | "PT" | "VV" | "FL" | string;
	Fade?: Range<0 | 9>;
	Highlights?: Range<-9 | 9>;
	ISO?: number | "Auto";
	Model: string;
	Saturation?: Range<-9 | 9>;
	Shadows?: Range<-9 | 9>;
	Sharpness?: Range<0 | 9>;
}

// ================= Canon =================
export interface CanonSettings {
	Brand: "Canon";
	ColorTone?: number;
	Contrast?: number;
	FilterEffect?: "Yellow" | "Red" | "Green";
	ISO?: number | "Auto";
	Model: string;
	PictureStyle?:
		| "Auto"
		| "Standard"
		| "Portrait"
		| "Landscape"
		| "Fine Detail"
		| "Neutral"
		| "Faithful"
		| "Monochrome";
	Saturation?: number;
	Sharpness?: "Normal" | "Soft" | "Hard";
	ToningEffect?: "Sepia" | "Blue" | "Green";
}

// ================= Nikon =================
export interface NikonSettings {
	Brand: "Nikon";
	Brightness?: number;
	Clarity?: number;
	Contrast?: number;
	FilterEffects?: "Yellow" | "Orange" | "Red" | "Green";
	Hue?: number;
	ISO?: number | "Auto";
	MidRangeSharpening?: number;
	Model: string;
	PictureControl?:
		| "Standard"
		| "Neutral"
		| "Vivid"
		| "Monochrome"
		| "Portrait"
		| "Landscape"
		| "Flat"
		| string;
	QuickSharp?: number;
	Saturation?: number;
	Sharpening?: number;
	Toning?: string;
}

// ================= Lumix =================
export interface LumixSettings {
	Brand: "Lumix";
	Clarity?: number;
	ColorNoiseReduction?: OnOff;
	Contrast?: number;
	FilterEffect?: "Yellow" | "Orange" | "Red" | "Green";
	GrainEffect?: "Off" | "Low" | "Standard" | "High";
	Highlight?: number;
	Hue?: number;
	ISO?: number | "Auto";
	Model: string;
	NoiseReduction?: Range<-5 | 5>;
	PhotoStyle?:
		| "Standard"
		| "Vivid"
		| "Natural"
		| "L. ClassicNeo"
		| "Flat"
		| "Cinelike D2"
		| "Cinelike V2"
		| "L. Monochrome S";
	Saturation?: number;
	Shadow?: number;
	Sharpness?: number;
}

// ================= Olympus =================
export interface OlympusSettings {
	Brand: "Olympus";
	ColorFilter?: "Neutral" | "Yellow" | "Orange" | "Red" | "Green";
	Contrast?: number;
	Gradation?: "Auto" | "Normal" | "High Key" | "Low Key";
	ISO?: number | "Auto";
	Model: string;

	PictureMode?:
		| "i-Enhance"
		| "Vivid"
		| "Natural"
		| "Muted"
		| "Portrait"
		| "Monochrome";
	PictureTone?: "Neutral" | "Sepia" | "Blue" | "Purple" | "Green";
	Saturation?: number;
	Sharpness?: number;
}

// ================= Ricoh =================
export interface RicohSettings {
	Brand: "Ricoh";
	Clarity?: number;
	Contrast?: number;
	ContrastHighlight?: number;
	ContrastShadow?: number;
	FilterEffect?: string;
	GrainEffect?: "Off" | "Weak" | "Medium" | "Strong";
	HighLowKeyAdjust?: number;
	Hue?: number;

	ImageControl?:
		| "Standard"
		| "Vivid"
		| "Positive Film"
		| "Bleach Bypass"
		| "Retro"
		| "High-Contrast B&W";
	ISO?: number | "Auto";
	Model: string;
	Saturation?: number;
	Shading?: number;
	Sharpness?: number;
	Toning?: string;
}

// ================= Hasselblad =================
export interface HasselbladSettings {
	Brand: "Hasselblad";
	Contrast?: number;

	ImageProfile?: "HNCS";
	ISO?: number | "Auto";
	Model: string;
	Sharpness?: number;
	WhiteBalance?: WBMode;
}

// ================= Leica =================
export interface LeicaSettings {
	Brand: "Leica";
	Contrast?: number;

	FilmStyle?:
		| "Standard"
		| "Vivid"
		| "Natural"
		| "Monochrome"
		| "Monochrome High Contrast";
	ISO?: number | "Auto";
	Model: string;
	Saturation?: number;
	Sharpness?: number;
	Toning?: "Sepia" | "Blue" | "Selenium";
	WhiteBalance?: WBMode;
}

// ================= Pentax =================
export interface PentaxSettings {
	Brand: "Pentax";
	Clarity?: number;
	Contrast?: number;

	CustomImage?:
		| "Bright"
		| "Natural"
		| "Portrait"
		| "Landscape"
		| "Vibrant"
		| "Radiant"
		| "Muted"
		| "Flat"
		| "Bleach Bypass"
		| "Reversal Film"
		| "Monochrome"
		| "Cross Processing";
	FilterEffect?: string;
	FineSharpness?: number;
	GrainEffect?: string;
	HighLowKey?: number;
	HighlightContrast?: number;
	Hue?: number;
	ISO?: number | "Auto";
	Model: string;
	Saturation?: number;
	ShadowContrast?: number;
	Sharpness?: number;
	Toning?: string;
}

// ================= Union =================
export type CameraSettings =
	| FujifilmSettings
	| SonySettings
	| CanonSettings
	| NikonSettings
	| LumixSettings
	| OlympusSettings
	| RicohSettings
	| HasselbladSettings
	| LeicaSettings
	| PentaxSettings;

// ================= Default Values =================
export const defaultFujifilm: FujifilmSettings = {
	Brand: "Fujifilm",
	Model: "",
	FilmMode: "Provia",
	GrainEffect: "Off",
	ColorChromeEffect: "Off",
	ColorChromeFXBlue: "Off",
	WhiteBalance: "Auto",
	DynamicRange: "DR100",
	HighlightTone: 0,
	ShadowTone: 0,
	Color: 0,
	Sharpness: 0,
	NoiseReduction: 0,
	Clarity: 0,
	ISO: 0,
};

export const defaultSony: SonySettings = {
	Brand: "Sony",
	Model: "",
	CreativeLook: "ST",
	Contrast: 0,
	Highlights: 0,
	Shadows: 0,
	Fade: 0,
	Saturation: 0,
	Sharpness: 0,
	Clarity: 0,
	ISO: 0,
};

export const defaultCanon: CanonSettings = {
	Brand: "Canon",
	Model: "",
	PictureStyle: "Auto",
	Sharpness: "Normal",
	Contrast: 0,
	Saturation: 0,
	ColorTone: 0,
	FilterEffect: "Yellow",
	ToningEffect: "Sepia",
	ISO: 0,
};

export const defaultNikon: NikonSettings = {
	Brand: "Nikon",
	Model: "",
	PictureControl: "Standard",
	QuickSharp: 0,
	Sharpening: 0,
	MidRangeSharpening: 0,
	Clarity: 0,
	Contrast: 0,
	Brightness: 0,
	Saturation: 0,
	Hue: 0,
	FilterEffects: "Yellow",
	Toning: "",
	ISO: 0,
};

export const defaultLumix: LumixSettings = {
	Brand: "Lumix",
	Model: "",
	PhotoStyle: "Standard",
	Contrast: 0,
	Highlight: 0,
	Shadow: 0,
	Saturation: 0,
	Hue: 0,
	FilterEffect: "Yellow",
	GrainEffect: "Off",
	ColorNoiseReduction: "Off",
	Sharpness: 0,
	NoiseReduction: 0,
	Clarity: 0,
	ISO: 0,
};

export const defaultOlympus: OlympusSettings = {
	Brand: "Olympus",
	Model: "",
	PictureMode: "Natural",
	Gradation: "Normal",
	Contrast: 0,
	Sharpness: 0,
	Saturation: 0,
	ColorFilter: "Neutral",
	PictureTone: "Neutral",
	ISO: 0,
};

export const defaultRicoh: RicohSettings = {
	Brand: "Ricoh",
	Model: "",
	ImageControl: "Standard",
	Saturation: 0,
	Hue: 0,
	HighLowKeyAdjust: 0,
	Contrast: 0,
	ContrastHighlight: 0,
	ContrastShadow: 0,
	Sharpness: 0,
	Shading: 0,
	Clarity: 0,
	Toning: "",
	FilterEffect: "",
	GrainEffect: "Off",
	ISO: 0,
};

export const defaultHasselblad: HasselbladSettings = {
	Brand: "Hasselblad",
	Model: "",
	ImageProfile: "HNCS",
	Contrast: 0,
	Sharpness: 0,
	WhiteBalance: "Auto",
	ISO: 0,
};

export const defaultLeica: LeicaSettings = {
	Brand: "Leica",
	Model: "",
	FilmStyle: "Standard",
	Contrast: 0,
	Saturation: 0,
	Sharpness: 0,
	Toning: "Sepia",
	WhiteBalance: "Auto",
	ISO: 0,
};

export const defaultPentax: PentaxSettings = {
	Brand: "Pentax",
	Model: "",
	CustomImage: "Bright",
	Saturation: 0,
	Hue: 0,
	HighLowKey: 0,
	Contrast: 0,
	HighlightContrast: 0,
	ShadowContrast: 0,
	Sharpness: 0,
	FineSharpness: 0,
	Clarity: 0,
	Toning: "",
	FilterEffect: "",
	GrainEffect: "Off",
	ISO: 0,
};

// Union default values lookup
export const defaultCameraSettings: Record<
	CameraSettings["Brand"],
	CameraSettings
> = {
	Fujifilm: defaultFujifilm,
	Sony: defaultSony,
	Canon: defaultCanon,
	Nikon: defaultNikon,
	Lumix: defaultLumix,
	Olympus: defaultOlympus,
	Ricoh: defaultRicoh,
	Hasselblad: defaultHasselblad,
	Leica: defaultLeica,
	Pentax: defaultPentax,
};

import { supabase } from "@/lib/supabase";
import type { CreatePhotoDto, PhotoResponseDto } from "../dtos/photo.dto";
import type { PhotoRepositoryInterface } from "../interfaces/photo-repository.interface";

export class PhotoRepository implements PhotoRepositoryInterface {
	async create(photo: CreatePhotoDto): Promise<PhotoResponseDto> {
		const { data, error } = await supabase
			.from("photos")
			.insert(photo)
			.select("*")
			.single();
		if (error) {
			throw error;
		}
		return data;
	}

	async getAll(): Promise<PhotoResponseDto[]> {
		const { data, error } = await supabase.from("photos").select("*");
		if (error) {
			throw error;
		}
		return data;
	}

	async getById(id: string): Promise<PhotoResponseDto> {
		const { data, error } = await supabase
			.from("photos")
			.select("*")
			.eq("photo_id", id);
		if (error) {
			throw error;
		}
		return data[0];
	}
}

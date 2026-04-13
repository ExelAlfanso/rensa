import type {
	UserRegisterDto,
	UserResponseDto,
	UserWithPasswordResponseDto,
} from "../dtos/user.dto";

export interface UserRepositoryInterface {
	create(user: UserRegisterDto): Promise<UserResponseDto>;

	getByEmail(email: string): Promise<UserWithPasswordResponseDto | null>;
	getById(id: string): Promise<UserResponseDto | null>;
	updateBookmarks(
		userId: string,
		photoId: string,
		action: "increment" | "decrement"
	): Promise<UserResponseDto | null>;
}

import type {
	UserLoginDto,
	UserRegisterDto,
	UserResponseDto,
} from "../dtos/user.dto";

export interface UserRepositoryInterface {
	create(user: UserRegisterDto): Promise<UserResponseDto>;

	getUser(): Promise<UserResponseDto>;

	login(user: UserLoginDto): Promise<UserResponseDto>;

	register(user: UserRegisterDto): Promise<UserResponseDto>;
}

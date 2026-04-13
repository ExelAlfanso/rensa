import type {
	UserRegisterDto,
	UserResponseDto,
	UserWithPasswordResponseDto,
} from "@/backend/dtos/user.dto";
import type { UserService } from "./user.service";

export class UsersApplication {
	private readonly userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	create(payload: UserRegisterDto): Promise<UserResponseDto> {
		return this.userService.create(payload);
	}

	getByEmail(email: string): Promise<UserWithPasswordResponseDto | null> {
		return this.userService.getByEmail(email);
	}

	getById(userId: string, actorId?: string): Promise<UserResponseDto> {
		return this.userService.getById(userId, actorId);
	}
}

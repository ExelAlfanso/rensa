import { UserRepository } from "@rensa/db/queries/user.repository";
import type {
	UserRegisterDto,
	UserResponseDto,
	UserWithPasswordResponseDto,
} from "@rensa/db/schema";
import { UserService } from "./service";

export class UsersController {
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

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const userController = new UsersController(userService);

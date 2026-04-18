import { UserService } from "./application/user.service";
import { UsersApplication } from "./application/users.application";
import { usersInfrastructure } from "./infrastructure/users.repositories";

const userService = new UserService(usersInfrastructure.userRepository);
const usersApplication = new UsersApplication(userService);

export const userDomain = {
	userService,
	usersApplication,
};

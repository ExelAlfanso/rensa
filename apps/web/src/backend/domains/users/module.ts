import { UserService } from "./application/user.service";
import { UsersApplication } from "./application/users.application";
import { usersInfrastructure } from "./infrastructure/users.repositories";

const usersApplication = new UsersApplication(
	new UserService(usersInfrastructure.userRepository)
);

export const userDomain = {
	...usersInfrastructure,
	usersApplication,
};

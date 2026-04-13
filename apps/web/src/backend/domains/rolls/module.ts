import { RollService } from "./application/roll.service";
import { RollsApplication } from "./application/rolls.application";
import { rollsInfrastructure } from "./infrastructure/rolls.repositories";

const rollsApplication = new RollsApplication(
	new RollService(
		rollsInfrastructure.rollRepository,
		rollsInfrastructure.photoRepository
	)
);

export const rollDomain = {
	...rollsInfrastructure,
	rollsApplication,
};

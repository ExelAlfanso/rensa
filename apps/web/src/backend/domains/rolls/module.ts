import { RollService } from "./application/roll.service";
import { RollsApplication } from "./application/rolls.application";
import { rollsInfrastructure } from "./infrastructure/rolls.repositories";

const rollService = new RollService(
	rollsInfrastructure.rollRepository,
	rollsInfrastructure.photoRepository
);
const rollsApplication = new RollsApplication(rollService);

export const rollDomain = {
	rollService,
	rollsApplication,
};

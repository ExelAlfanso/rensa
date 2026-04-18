import { ContactRepository } from "./contact.repository";

const contactRepository = new ContactRepository();

export const contactsInfrastructure = {
	contactRepository,
};

import { ContactService } from "./application/contact.service";
import { ContactsApplication } from "./application/contacts.application";
import { contactsInfrastructure } from "./infrastructure/contacts.repositories";

const contactService = new ContactService(
	contactsInfrastructure.contactRepository
);
const contactsApplication = new ContactsApplication(contactService);

export const contactDomain = {
	contactService,
	contactsApplication,
};

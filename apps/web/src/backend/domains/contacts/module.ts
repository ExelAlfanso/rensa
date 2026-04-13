import { ContactService } from "./application/contact.service";
import { ContactsApplication } from "./application/contacts.application";
import { contactsInfrastructure } from "./infrastructure/contacts.repositories";

const contactsApplication = new ContactsApplication(
	new ContactService(contactsInfrastructure.contactRepository)
);

export const contactDomain = {
	...contactsInfrastructure,
	contactsApplication,
};

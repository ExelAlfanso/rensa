import { ContactRepository } from "@rensa/db/queries/contact.repository";
import type { CreateContactDto, ListContactsQueryDto } from "@rensa/db/schema";
import {
	type ContactListResult,
	ContactService,
	type ContactSubmitResult,
} from "./service";

export class ContactsController {
	private readonly contactService: ContactService;

	constructor(contactService: ContactService) {
		this.contactService = contactService;
	}

	list(
		query: ListContactsQueryDto,
		actorRole?: string
	): Promise<ContactListResult> {
		return this.contactService.list(query, actorRole);
	}

	submit(
		payload: CreateContactDto,
		context: {
			ipAddress: string;
			userAgent: string;
		}
	): Promise<ContactSubmitResult> {
		return this.contactService.submit(payload, context);
	}
}

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);

export const contactController = new ContactsController(contactService);

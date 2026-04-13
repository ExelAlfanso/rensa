import type {
	CreateContactDto,
	ListContactsQueryDto,
} from "@/backend/dtos/contact.dto";
import type { ContactService } from "./contact.service";

export class ContactsApplication {
	private readonly contactService: ContactService;

	constructor(contactService: ContactService) {
		this.contactService = contactService;
	}

	list(query: ListContactsQueryDto, actorRole?: string): Promise<unknown> {
		return this.contactService.list(query, actorRole);
	}

	submit(
		payload: CreateContactDto,
		context: {
			ipAddress: string;
			userAgent: string;
		}
	): Promise<unknown> {
		return this.contactService.submit(payload, context);
	}
}

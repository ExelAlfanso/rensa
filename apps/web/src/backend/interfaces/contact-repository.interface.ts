import type {
	ContactResponseDto,
	ListContactsQueryDto,
} from "../dtos/contact.dto";

export interface ListContactsResult {
	contacts: ContactResponseDto[];
	total: number;
}

export interface ContactRepositoryInterface {
	create(params: {
		name: string;
		email: string;
		subject: string;
		message: string;
		ipAddress: string;
		userAgent: string;
	}): Promise<ContactResponseDto>;
	list(query: ListContactsQueryDto): Promise<ListContactsResult>;
}

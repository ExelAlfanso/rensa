import { count, desc, eq } from "drizzle-orm";
import { contacts } from "@/backend/db/schema";
import type {
	ContactResponseDto,
	ListContactsQueryDto,
} from "@/backend/dtos/contact.dto";
import type {
	ContactRepositoryInterface,
	ListContactsResult,
} from "@/backend/interfaces/contact-repository.interface";
import db from "@/lib/drizzle";

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

export class ContactRepository implements ContactRepositoryInterface {
	async create(params: {
		name: string;
		email: string;
		subject: string;
		message: string;
		ipAddress: string;
		userAgent: string;
	}): Promise<ContactResponseDto> {
		const [row] = await db
			.insert(contacts)
			.values({
				name: params.name,
				email: params.email,
				subject: params.subject,
				message: params.message,
				ipAddress: params.ipAddress,
				userAgent: params.userAgent,
				status: "new",
			})
			.returning();
		if (!row) {
			throw new Error("Failed to create contact");
		}

		return {
			_id: row.contactId,
			name: row.name,
			email: row.email,
			subject: row.subject,
			message: row.message,
			ipAddress: row.ipAddress ?? "",
			userAgent: row.userAgent ?? undefined,
			status: row.status ?? "new",
			respondedAt: toIso(row.respondedAt),
			createdAt: toIso(row.createdAt),
			updatedAt: toIso(row.updatedAt),
		};
	}

	async list(query: ListContactsQueryDto): Promise<ListContactsResult> {
		const from = (query.page - 1) * query.limit;

		const rows = await db
			.select()
			.from(contacts)
			.where(eq(contacts.status, query.status))
			.orderBy(desc(contacts.createdAt))
			.limit(query.limit)
			.offset(from);
		const [countRow] = await db
			.select({ total: count() })
			.from(contacts)
			.where(eq(contacts.status, query.status));

		const mapped = rows.map((contact) => ({
			_id: contact.contactId,
			name: contact.name,
			email: contact.email,
			subject: contact.subject,
			message: contact.message,
			ipAddress: contact.ipAddress ?? "",
			userAgent: contact.userAgent ?? undefined,
			status: contact.status ?? "new",
			respondedAt: toIso(contact.respondedAt),
			createdAt: toIso(contact.createdAt),
			updatedAt: toIso(contact.updatedAt),
		}));

		return {
			contacts: mapped as ContactResponseDto[],
			total: Number(countRow?.total ?? 0),
		};
	}
}

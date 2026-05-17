import { count, desc, eq } from "drizzle-orm";
import type {
	ContactRepositoryInterface,
	ContactResponseDto,
	ListContactsQueryDto,
	ListContactsResult,
} from "../schemas/contacts";
import { contacts } from "../schemas/contacts";
import db from "../src/db";

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

export class ContactRepository implements ContactRepositoryInterface {
	async create(params: {
		name: string;
		email: string;
		subject: string;
		message: string;
		ip_address: string;
		user_agent: string;
	}): Promise<ContactResponseDto> {
		const [row] = await db
			.insert(contacts)
			.values({
				name: params.name,
				email: params.email,
				subject: params.subject,
				message: params.message,
				ip_address: params.ip_address,
				user_agent: params.user_agent,
				status: "new",
			})
			.returning();
		if (!row) {
			throw new Error("Failed to create contact");
		}

		return {
			_id: row.contact_id,
			name: row.name,
			email: row.email,
			subject: row.subject,
			message: row.message,
			ip_address: row.ip_address ?? "",
			user_agent: row.user_agent ?? undefined,
			status: row.status ?? "new",
			responded_at: toIso(row.responded_at),
			created_at: toIso(row.created_at),
			updated_at: toIso(row.updated_at),
		};
	}

	async list(query: ListContactsQueryDto): Promise<ListContactsResult> {
		const from = (query.page - 1) * query.limit;

		const rows = await db
			.select()
			.from(contacts)
			.where(eq(contacts.status, query.status))
			.orderBy(desc(contacts.created_at))
			.limit(query.limit)
			.offset(from);
		const [countRow] = await db
			.select({ total: count() })
			.from(contacts)
			.where(eq(contacts.status, query.status));

		const mapped = rows.map((contact) => ({
			_id: contact.contact_id,
			name: contact.name,
			email: contact.email,
			subject: contact.subject,
			message: contact.message,
			ip_address: contact.ip_address ?? "",
			user_agent: contact.user_agent ?? undefined,
			status: contact.status ?? "new",
			responded_at: toIso(contact.responded_at),
			created_at: toIso(contact.created_at),
			updated_at: toIso(contact.updated_at),
		}));

		return {
			contacts: mapped as ContactResponseDto[],
			total: Number(countRow?.total ?? 0),
		};
	}
}

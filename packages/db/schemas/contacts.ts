import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contactStatusEnum } from "./enums";

export const contacts = pgTable(
	"contacts",
	{
		contact_id: uuid("contact_id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		subject: text("subject").notNull(),
		message: text("message").notNull(),
		ip_address: text("ip_address"),
		user_agent: text("user_agent"),
		status: contactStatusEnum("status").default("new"),
		responded_at: timestamp("responded_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_contacts_email").on(table.email)]
);

interface Passthrough {
	[key: string]: unknown;
}

export type ContactStatus = "new" | "read" | "responded";

export interface ContactResponseDto extends Passthrough {
	_id: string;
	created_at?: string;
	email: string;
	ip_address: string;
	message: string;
	name: string;
	responded_at?: string;
	status: ContactStatus;
	subject: string;
	updated_at?: string;
	user_agent?: string;
}

export interface CreateContactDto {
	email: string;
	message: string;
	name: string;
	subject: string;
}

export interface ListContactsQueryDto {
	limit: number;
	page: number;
	status: ContactStatus;
}

export interface ListContactsResult {
	contacts: ContactResponseDto[];
	total: number;
}

export interface ContactRepositoryInterface {
	create(params: {
		email: string;
		ip_address: string;
		message: string;
		name: string;
		subject: string;
		user_agent: string;
	}): Promise<ContactResponseDto>;
	list(query: ListContactsQueryDto): Promise<ListContactsResult>;
}

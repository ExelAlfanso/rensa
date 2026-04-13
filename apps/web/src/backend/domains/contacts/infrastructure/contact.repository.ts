import type {
	ContactResponseDto,
	ListContactsQueryDto,
} from "@/backend/dtos/contact.dto";
import type {
	ContactRepositoryInterface,
	ListContactsResult,
} from "@/backend/interfaces/contact-repository.interface";
import { supabaseAdmin } from "@/lib/supabase";

export class ContactRepository implements ContactRepositoryInterface {
	async create(params: {
		name: string;
		email: string;
		subject: string;
		message: string;
		ipAddress: string;
		userAgent: string;
	}): Promise<ContactResponseDto> {
		const { data, error } = await supabaseAdmin
			.from("contacts")
			.insert({
				name: params.name,
				email: params.email,
				subject: params.subject,
				message: params.message,
				ip_address: params.ipAddress,
				user_agent: params.userAgent,
				status: "new",
			})
			.select(
				"contact_id,name,email,subject,message,ip_address,user_agent,status,responded_at,created_at,updated_at"
			)
			.single();
		if (error || !data) {
			throw new Error(
				`Failed to create contact: ${error?.message ?? "No data"}`
			);
		}

		return {
			_id: data.contact_id,
			name: data.name,
			email: data.email,
			subject: data.subject,
			message: data.message,
			ipAddress: data.ip_address,
			userAgent: data.user_agent ?? undefined,
			status: data.status,
			respondedAt: data.responded_at ?? undefined,
			createdAt: data.created_at ?? undefined,
			updatedAt: data.updated_at ?? undefined,
		};
	}

	async list(query: ListContactsQueryDto): Promise<ListContactsResult> {
		const from = (query.page - 1) * query.limit;
		const to = from + query.limit - 1;

		const { data, error, count } = await supabaseAdmin
			.from("contacts")
			.select(
				"contact_id,name,email,subject,message,ip_address,user_agent,status,responded_at,created_at,updated_at",
				{ count: "exact" }
			)
			.eq("status", query.status)
			.order("created_at", { ascending: false })
			.range(from, to);
		if (error) {
			throw new Error(`Failed to list contacts: ${error.message}`);
		}

		const contacts = (data ?? []).map((contact) => ({
			_id: contact.contact_id,
			name: contact.name,
			email: contact.email,
			subject: contact.subject,
			message: contact.message,
			ipAddress: contact.ip_address ?? "",
			userAgent: contact.user_agent ?? undefined,
			status: contact.status,
			respondedAt: contact.responded_at ?? undefined,
			createdAt: contact.created_at ?? undefined,
			updatedAt: contact.updated_at ?? undefined,
		}));

		return {
			contacts: contacts as ContactResponseDto[],
			total: count ?? 0,
		};
	}
}

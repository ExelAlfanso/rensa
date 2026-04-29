import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { env } from "../../config/env";
import { NotificationService } from "./notification.service";

export const notificationController = new Elysia({ prefix: "/notifications" })
	.use(
		jwt({
			name: "jwt",
			secret: env.jwtSecret,
		})
	)
	.derive(async ({ jwt, headers }) => {
		const auth = headers.authorization;
		if (!auth) {
			return {};
		}

		const token = auth.replace("Bearer ", "");
		const payload = await jwt.verify(token);

		if (!payload) {
			return {};
		}

		return { user: payload as { id: string } };
	})
	.post(
		"",
		async ({ user, body }) => {
			if (!user?.id) {
				return { success: false, message: "Unauthorized" };
			}

			return await NotificationService.notify({
				actorId: user.id,
				recipientId: body.recipientId,
				photoId: body.photoId,
				type: body.type,
			});
		},
		{
			body: t.Object({
				recipientId: t.String(),
				photoId: t.String(),
				type: t.String(),
			}),
		}
	)
	.get(
		"",
		async ({ user, query }) => {
			if (!user?.id) {
				return { success: false, message: "Unauthorized" };
			}

			return await NotificationService.fetchNotifications({
				recipientId: user.id,
				page: query.page,
				limit: query.limit,
			});
		},
		{
			query: t.Object({
				page: t.Optional(t.Numeric()),
				limit: t.Optional(t.Numeric()),
			}),
		}
	)
	.put(
		"/:id/read",
		async ({ params }) =>
			await NotificationService.markNotificationAsRead(params.id),
		{
			params: t.Object({
				id: t.String(),
			}),
		}
	)
	.delete(
		"/:userId",
		async ({ params }) =>
			await NotificationService.clearNotifications(params.userId),
		{
			params: t.Object({
				userId: t.String(),
			}),
		}
	);

import type {
  CreateNotificationDto,
  ListNotificationsQueryDto,
  NotificationRepositoryInterface,
  NotificationResponseDto,
} from "../schemas/notifications";

interface NotificationsApiResponse {
  data?: {
    notifications?: NotificationResponseDto[];
  };
}

interface NotificationApiClient {
  delete(url: string): Promise<unknown>;
  get<T>(url: string, config?: { params?: unknown }): Promise<{ data: T }>;
  post<T = unknown>(url: string, data?: unknown): Promise<{ data: T }>;
  put(url: string): Promise<unknown>;
}

export class NotificationRepository implements NotificationRepositoryInterface {
  private readonly api: NotificationApiClient;

  constructor(api: NotificationApiClient) {
    this.api = api;
  }

  async list(
    query: ListNotificationsQueryDto,
  ): Promise<NotificationResponseDto[]> {
    try {
      const response = await this.api.get<NotificationsApiResponse>(
        "/notifications",
        { params: query },
      );
      return response.data.data?.notifications ?? [];
    } catch (error) {
      throw this.mapAxiosError(error, "Failed to fetch notifications");
    }
  }

  async create(payload: CreateNotificationDto): Promise<unknown> {
    try {
      const response = await this.api.post("/notifications", payload);
      return response.data;
    } catch (error) {
      throw this.mapAxiosError(error, "Failed to create notification");
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw this.mapAxiosError(error, "Failed to mark notification as read");
    }
  }

  async clearByUserId(userId: string): Promise<void> {
    try {
      await this.api.delete(`/notifications/${userId}`);
    } catch (error) {
      throw this.mapAxiosError(error, "Failed to clear notifications");
    }
  }

  private mapAxiosError(error: unknown, fallbackMessage: string): Error {
    if (typeof error === "object" && error !== null) {
      const maybeError = error as {
        message?: unknown;
        response?: { data?: { message?: unknown } };
      };
      const responseMessage =
        typeof maybeError.response?.data?.message === "string"
          ? maybeError.response.data.message
          : null;
      const errorMessage =
        typeof maybeError.message === "string" ? maybeError.message : null;
      return new Error(responseMessage ?? errorMessage ?? fallbackMessage);
    }
    return new Error(fallbackMessage);
  }
}

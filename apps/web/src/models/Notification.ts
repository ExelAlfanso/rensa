export interface NotificationData {
  id: string;
  recipientId: string;
  actorId: {
    id: string;
    username: string;
    avatar: string;
  };
  photoId: string;
  type: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

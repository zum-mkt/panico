export type NotificationSubscriber = {
  id: string;
  name: string | null;
  email: string;
  status: "pending" | "confirmed" | "unsubscribed";
  confirm_token: string;
  unsubscribe_token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

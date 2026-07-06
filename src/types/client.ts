export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  plan_id: string | null;
  card_number: string;
  member_since: string;
  created_at: string;
};

export type ClientDependent = {
  id: string;
  client_id: string;
  name: string;
  birth_date: string | null;
  relationship: string | null;
};

export type ClientDocument = {
  id: string;
  client_id: string;
  title: string;
  file_url: string;
  created_at: string;
};

export type ClientHistoryEntry = {
  id: string;
  client_id: string;
  description: string;
  occurred_at: string;
};

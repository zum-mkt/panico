export type FormFieldType = "text" | "textarea" | "email" | "phone" | "select" | "checkbox";

export type FormFieldDef = {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
};

export type DynamicForm = {
  id: string;
  title: string;
  slug: string;
  fields: FormFieldDef[];
  notify_email: string | null;
  is_active: boolean;
  created_at: string;
};

export type FormSubmission = {
  id: string;
  form_id: string;
  data: Record<string, string | boolean>;
  created_at: string;
};

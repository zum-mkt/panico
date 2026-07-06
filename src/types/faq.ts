export type Faq = {
  id: string;
  question: string;
  answer: string;
  context: string | null;
  position: number;
  is_active: boolean;
};

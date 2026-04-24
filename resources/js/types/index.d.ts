import { Config } from "ziggy-js";
/**
 * Authenticated user interface.
 */
export interface User {
  id: number;
  email: string;
  email_verified_at?: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
    notificationCount?: number;
  };
  ziggy: Config & { location: string };
};

export type CardData = {
  id: number;
  pan: string;
  cvv?: string;
  expire_date?: string;
  balance: number;
  payment_network: string;
  type?: string;
};

export type PaginatedData<T> = {
  data: T[];
  links: any[];
  meta?: any;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

export type Transaction = {
  id: number;
  from_card_id?: number;
  to_card_id?: number;
  from_card?: CardData;
  to_card?: CardData;
  type: string;
  amount: number;
  created_at: string;
};

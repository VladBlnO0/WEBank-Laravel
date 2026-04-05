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
export type Transaction = {
  id: number;
  from_card_id?: number;
  to_card_id?: number;
  type: string;
  amount: number;
  created_at: string;
};

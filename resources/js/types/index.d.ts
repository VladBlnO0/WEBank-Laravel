import { Config } from "ziggy-js";
/**
 * Authenticated user interface.
 */
export interface User {
  /** id */
  id: number;
  /** name */
  name: string;
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
  id?: number;
  number: string;
  balance: number;
  expire_date?: number;
  status?: string;
  payment_network: string;
  type?: string;
  limit_amount?: number;
  cvv?: string;
  monthly_inflow: number;
  monthly_outflow: number;
};
export type TransactionsList = {
  transactions: Tran[];
};
export type Tran = {
  id: number;
  from_card_id?: number;
  to_card_id?: number;
  label: string;
  type: string;
  date: Date;
  description?: string;
  amount: number;
};

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
  balance: string | number;
  expire_date?: Date;
  status?: string;
  payment_network: string;
  type?: string;
  limit_amount?: number;
  cvv?: string;
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
export type ServiceProvider = {
  name: string;
  category: string;
  edrpou: string;
};
export type ServicePayment = {
  amount: number;
  next_date: Date;
  is_payed: boolean;
  due_date: Date;
  service_provider_id: number;
};

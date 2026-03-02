import { Config } from 'ziggy-js';
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

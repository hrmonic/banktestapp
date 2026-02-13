/**
 * Compte bancaire de démo utilisé par le module Accounts.
 */
export type Account = {
  id: string;
  holder: string;
  iban: string;
  type: string;
  status: string;
  balance: number;
  currency: string;
};

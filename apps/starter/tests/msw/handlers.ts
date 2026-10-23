import { http, HttpResponse } from 'msw';

// Handlers MSW partagés pour simuler des APIs "réalistes" dans les tests Vitest.
export const accountHandlers = [
  http.get('https://api.example.com/accounts', () =>
    HttpResponse.json([
      {
        id: 'ACC-0001',
        holder: 'Jean Dupont',
        iban: 'FR761234567890',
        type: 'Compte courant',
        status: 'Actif',
        balance: 1200,
        currency: 'EUR',
      },
    ])
  ),
];

export const transactionHandlers = [
  http.get('https://api.example.com/transactions', () =>
    HttpResponse.json([
      {
        id: 'TRX-0001',
        accountId: 'ACC-0001',
        amount: -42,
        currency: 'EUR',
        type: 'Carte',
        status: 'Confirmée',
      },
    ])
  ),
];

// Demo adapter for accounts listing and details.
// Everything is in-memory to keep the starter app self-contained.

const DEMO_ACCOUNTS = [
  {
    id: "ACC-0001",
    holder: "Dupont Marie",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    type: "Courant",
    status: "Actif",
    balance: 3540.75,
    currency: "EUR",
  },
  {
    id: "ACC-0002",
    holder: "SAS TechFinance",
    iban: "FR76 3000 6000 0223 4567 8901 234",
    type: "Entreprise",
    status: "Actif",
    balance: 987654.12,
    currency: "EUR",
  },
  {
    id: "ACC-0003",
    holder: "Martin Paul",
    iban: "FR76 1027 8060 9912 3456 7890 123",
    type: "Épargne",
    status: "Suspendu",
    balance: 12000.0,
    currency: "EUR",
  },
  {
    id: "ACC-0004",
    holder: "Martin Sophie",
    iban: "FR76 3000 6000 0334 5678 9012 345",
    type: "Courant",
    status: "Actif",
    balance: 2450.5,
    currency: "EUR",
  },
];

export async function listAccounts() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return DEMO_ACCOUNTS;
}

export async function getAccountById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DEMO_ACCOUNTS.find((acc) => acc.id === id) || null;
}



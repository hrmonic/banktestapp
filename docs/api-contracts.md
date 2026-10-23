# Contrats d'API (endpoints)

Documentation des endpoints attendus lorsque l'application est branchée sur une API réelle (auth.mode !== "demo"). Les adaptateurs utilisent ces chemins avec `createApiClient(config)`.

## Comptes (accounts)

- `GET /accounts` → `Account[]`
- `GET /accounts/:id` → `Account` (404 si absent)

## Dashboard

- `GET /dashboard/kpis` → `DashboardKpis`
- `GET /dashboard/alerts` → `DashboardAlert[]`
- `GET /dashboard/balance-history` → `BalanceHistoryPoint[]`
- `GET /dashboard/transactions-by-type` → `TransactionsByTypeItem[]`
- `GET /dashboard/recent-activity` → `RecentActivityItem[]`

## Transactions

- `GET /transactions` (query: `status`, `search`, `page`, `limit`) → `TransactionRow[]`

## Approbations

- `GET /approvals` → `ApprovalRequest[]`

## Users & Roles

- `GET /users` (query: `search`, `page`, `limit`) → `UsersRolesUser[]`

## Audit

- `GET /audit/events` (query: `search`, `page`, `limit`) → `AuditEvent[]`

## Reports

- `GET /reports` → `Report[]`
- `GET /reports/:id/download` → binaire (Content-Disposition, PDF ou XLSX). Le client utilise `api.getBlob(path)`.

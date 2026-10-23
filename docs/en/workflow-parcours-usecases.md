# User journeys and use cases by role

This document describes **user journeys** and **use cases** per business profile for the starter app. It supports onboarding, E2E testing, and product alignment.

---

## 1. Profiles and accessible modules

| Profile (demo)   | Technical ID       | Accessible modules (sidebar)                                                | Main use case                         |
| ---------------- | ------------------ | --------------------------------------------------------------------------- | ------------------------------------- |
| Agent            | `agent-agence`     | Dashboard, Accounts                                                         | View client accounts, recent activity |
| Manager          | `manager-agence`   | Dashboard, Accounts, Transactions, Reports                                  | Run branch, volumes, reports          |
| Audit Analyst    | `analyste-audit`   | Dashboard, Transactions, Audit, Reports                                     | Audit log, compliance, anomalies      |
| Backoffice Admin | `admin-backoffice` | Dashboard, Accounts, Transactions, Approvals, Users & Roles, Reports, Audit | User management, audit, accounts      |
| Super Admin      | `super-admin`      | All modules                                                                 | Full access (demo)                    |

**Source of truth**: `apps/starter/src/core/constants.ts` (PROFILE_IDS, PERMISSIONS), `apps/starter/src/lib/security/profilePermissions.ts`, and each module in `apps/starter/src/modules/*/module.tsx` (permissionsRequired, basePath).

---

## 2. Main screens per module

| Module        | Route (basePath) | Main screens                  | Typical actions (demo)               |
| ------------- | ---------------- | ----------------------------- | ------------------------------------ |
| Dashboard     | `/dashboard`     | KPIs, alerts, recent activity | View metrics, links to other modules |
| Accounts      | `/accounts`      | Account list, account detail  | Browse list, open account            |
| Transactions  | `/transactions`  | Transaction history           | Filter, view                         |
| Approvals     | `/approvals`     | Approval queue                | (demo)                               |
| Users & Roles | `/users-roles`   | User and role management      | (admin only)                         |
| Reports       | `/reports`       | Reports and exports           | View reports                         |
| Audit         | `/audit`         | Audit log                     | View events                          |

---

## 3. Global flow

1. **Load**: `client.config.json` → Zod validation → list of enabled modules.
2. **Unauthenticated**: redirect to `/login`.
3. **Login**: choose profile (demo), email, password → session in memory + redirect to first allowed module (or `/no-modules` if none enabled).
4. **Authenticated**: AppShell (sidebar + content). Sidebar = enabled modules the user is allowed to access.
5. **Unauthorized URL**: redirect to `/unauthorized` (with “Back to dashboard” and “Log out” links).
6. **Logout**: “Déconnexion” button in sidebar → back to `/login`. To switch profile in demo: log out then choose another profile on the login page.

---

## 4. E2E workflow checklist

To cover in E2E tests (Playwright):

- [ ] **Config**: load with valid config; invalid config shows dedicated error page.
- [ ] **Login**: with each profile (agent, manager, analyst, admin, super-admin), assert redirect and visible sidebar modules.
- [ ] **Navigation**: access each allowed module for a given profile; sidebar links work.
- [ ] **RBAC**: user without permission (e.g. agent) accesses protected URL (e.g. `/users-roles`) → “Access denied” page or redirect.
- [ ] **Unauthorized**: on `/unauthorized`, “Back to home” and “Log out” links are present and work.
- [ ] **Logout**: click “Déconnexion” in sidebar → redirect to `/login`, session cleared.
- [ ] **No modules**: config with all modules disabled, authenticated user → redirect to `/no-modules`, “No modules enabled” page with “Log out” button.

---

## 5. References

- Architecture: `docs/en/architecture.md`
- Security and RBAC: `docs/en/security-compliance.md`
- Testing: `docs/en/testing-and-quality.md`, `apps/starter/tests/e2e/`

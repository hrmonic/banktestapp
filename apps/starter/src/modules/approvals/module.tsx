/**
 * Module Approvals : demandes d'approbation (démo ou API).
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { ModuleLoadingFallback } from '../../components/ModuleLoadingFallback';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmActionModal } from '../../components/ConfirmActionModal';
import { useNotify } from '../../lib/notifications/NotificationContext';
import type { ApprovalRequest } from './types';
import type { BankModule } from '../../core/types';
import { useApiClient } from '../../lib/api/useApiClient';
import {
  listApprovals,
  approveApproval,
  rejectApproval,
} from '../../lib/adapters/approvalsAdapter';

type ConfirmAction = 'approve' | 'reject' | null;

function ApprovalsHome(): React.ReactElement {
  const { t } = useTranslation();
  const api = useApiClient();
  const { notify } = useNotify();
  const [items, setItems] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<ApprovalRequest | null>(null);
  const [modalAction, setModalAction] = useState<ConfirmAction>(null);
  const [modalReason, setModalReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await listApprovals(api);
      setItems(list);
    } catch {
      setLoadError(t('approvals.loadError', 'Error loading approvals'));
    } finally {
      setLoading(false);
    }
  }, [api, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openModal = (item: ApprovalRequest, action: 'approve' | 'reject') => {
    setModalItem(item);
    setModalAction(action);
    setModalReason('');
  };
  const closeModal = () => {
    setModalItem(null);
    setModalAction(null);
    setModalReason('');
  };
  const handleConfirm = useCallback(async () => {
    if (!modalItem || !modalAction) return;
    setSubmitting(true);
    try {
      if (modalAction === 'approve') {
        await approveApproval(api, modalItem.id, modalReason);
        notify(t('approvals.approvedSuccess', 'Demande approuvée.'), 'success');
      } else {
        await rejectApproval(api, modalItem.id, modalReason);
        notify(t('approvals.rejectedSuccess', 'Demande rejetée.'), 'success');
      }
      closeModal();
      void loadData();
    } catch {
      notify(t('approvals.actionError', "Une erreur s'est produite."), 'error');
    } finally {
      setSubmitting(false);
    }
  }, [api, modalItem, modalAction, modalReason, notify, loadData, t]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">{t('approvals.title')}</h1>
        <p className="text-sm text-slate-600">{t('approvals.subtitle')}</p>
      </header>

      {loadError ? (
        <Card
          variant="error"
          title={t('common.loadErrorTitle', 'Erreur de chargement')}
          description={loadError}
        >
          <Button type="button" variant="primary" onClick={() => loadData()}>
            {t('common.retry', 'Réessayer')}
          </Button>
        </Card>
      ) : (
        <Card>
          {loading ? (
            <ModuleLoadingFallback message={t('approvals.loading')} />
          ) : items.length === 0 ? (
            <EmptyState
              message={t(
                'approvals.emptyMessage',
                "Tout est à jour. Aucune demande d'approbation en attente."
              )}
              actionLabel={t('approvals.viewAudit', "Voir le journal d'audit")}
              actionTo="/audit"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:bg-[var(--dm-thead)] dark:border-[var(--dm-border)]">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Demandeur
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Montant
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Statut
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right w-40">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-[var(--dm-border)] dark:hover:bg-[var(--dm-surface-hover)] transition-colors"
                    >
                      <td
                        data-table-cell
                        className="px-3 py-2.5 font-mono text-xs text-slate-700"
                      >
                        {item.id}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-900"
                      >
                        {item.type}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-700"
                      >
                        {item.requester}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-right tabular-nums text-slate-900"
                      >
                        {item.amount.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: item.currency,
                        })}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-700"
                      >
                        {item.status}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-right space-x-2"
                      >
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                          onClick={() => openModal(item, 'approve')}
                          disabled={item.status !== 'En attente'}
                        >
                          {t('approvals.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500"
                          onClick={() => openModal(item, 'reject')}
                          disabled={item.status !== 'En attente'}
                        >
                          {t('approvals.reject')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {modalItem && modalAction && (
        <ConfirmActionModal
          open={true}
          onClose={closeModal}
          title={
            modalAction === 'approve'
              ? t('approvals.confirmApproveTitle', 'Approuver la demande')
              : t('approvals.confirmRejectTitle', 'Rejeter la demande')
          }
          description={t(
            'approvals.confirmContext',
            'Demande {{type}} — Demandeur : {{requester}} — Montant : {{amount}}',
            {
              type: modalItem.type,
              requester: modalItem.requester,
              amount: modalItem.amount.toLocaleString('fr-FR', {
                style: 'currency',
                currency: modalItem.currency,
              }),
            }
          )}
          reasonLabel={t('approvals.reasonLabel', 'Motif (optionnel)')}
          reasonValue={modalReason}
          onReasonChange={setModalReason}
          confirmLabel={
            modalAction === 'approve'
              ? t('approvals.approve')
              : t('approvals.reject')
          }
          confirmVariant={modalAction === 'reject' ? 'danger' : 'primary'}
          onConfirm={handleConfirm}
          loading={submitting}
        />
      )}
    </div>
  );
}

function ApprovalsRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<ApprovalsHome />} />
    </Routes>
  );
}

const approvalsModule: BankModule = {
  id: 'approvals',
  name: 'Approvals',
  basePath: '/approvals',
  routes: ApprovalsRoutes,
  sidebarItems: [{ label: 'Approvals', to: '/approvals', order: 3 }],
  permissionsRequired: ['transactions:view'],
};

export default approvalsModule;

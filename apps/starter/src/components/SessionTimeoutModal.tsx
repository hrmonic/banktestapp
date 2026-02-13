/**
 * Modal d'avertissement de déconnexion (timeout d'inactivité).
 */
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@bank/ui';

type SessionTimeoutModalProps = {
  open: boolean;
  secondsLeft: number;
  onExtend: () => void;
  onLogout: () => void;
};

export function SessionTimeoutModal({
  open,
  secondsLeft,
  onExtend,
  onLogout,
}: SessionTimeoutModalProps): React.ReactElement {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
          aria-describedby="session-timeout-description"
          aria-labelledby="session-timeout-title"
        >
          <Dialog.Title
            id="session-timeout-title"
            className="text-lg font-semibold text-slate-900"
          >
            Session sur le point d'expirer
          </Dialog.Title>
          <p
            id="session-timeout-description"
            className="mt-2 text-sm text-slate-600"
          >
            Vous allez être déconnecté dans <strong>{secondsLeft}</strong>{' '}
            seconde
            {secondsLeft !== 1 ? 's' : ''} par mesure de sécurité.
            Souhaitez-vous rester connecté ?
          </p>
          <div className="mt-6 flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onLogout}>
              Se déconnecter
            </Button>
            <Button type="button" variant="primary" onClick={onExtend}>
              Rester connecté
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

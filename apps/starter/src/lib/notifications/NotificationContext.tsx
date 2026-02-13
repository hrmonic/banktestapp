/**
 * Contexte de notifications (toast) avec hook useNotify.
 * Accessibilité : role="status" et aria-live via Radix Toast.
 */
import React, { createContext, useCallback, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

export type NotificationVariant = 'info' | 'success' | 'error' | 'warning';

type NotificationState = {
  message: string;
  variant: NotificationVariant;
  open: boolean;
};

type NotificationContextValue = {
  notify: (message: string, variant?: NotificationVariant) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [state, setState] = useState<NotificationState>({
    message: '',
    variant: 'info',
    open: false,
  });

  const notify = useCallback(
    (message: string, variant: NotificationVariant = 'info') => {
      setState({ message, variant, open: true });
    },
    []
  );

  const onOpenChange = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, open }));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Toast.Provider duration={5000} label="Notification">
        {children}
        <Toast.Root
          open={state.open}
          onOpenChange={onOpenChange}
          type="foreground"
          duration={5000}
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full"
          role="status"
          aria-live="polite"
        >
          <Toast.Description className="text-sm text-slate-800">
            {state.message}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 outline-none sm:max-w-[420px]" />
      </Toast.Provider>
    </NotificationContext.Provider>
  );
}

export function useNotify(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotify must be used within NotificationProvider');
  }
  return ctx;
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import approvalsModule from '../../src/modules/approvals/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { NotificationProvider } from '../../src/lib/notifications/NotificationContext';
import { testClientConfig } from '../testConfig';

describe('approvals module', () => {
  it("rend la page d'accueil des validations", () => {
    const RoutesComponent = approvalsModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <NotificationProvider>
            <Routes>
              <Route path="/*" element={<RoutesComponent />} />
            </Routes>
          </NotificationProvider>
        </ConfigProvider>
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Demandes d.approbation/i })
    ).toBeInTheDocument();
  });
});

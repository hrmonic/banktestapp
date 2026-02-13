import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import auditModule from '../../src/modules/audit/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('audit module', () => {
  it("rend la page d'accueil d'audit", () => {
    const RoutesComponent = auditModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Journal d'audit/i })
    ).toBeInTheDocument();
  });
});

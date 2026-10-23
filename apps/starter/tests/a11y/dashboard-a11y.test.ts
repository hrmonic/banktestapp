import { test, expect } from 'vitest';
import axe from 'axe-core';
import React from 'react';
import { render } from '@testing-library/react';
import DashboardModule from '../../src/modules/dashboard/module';
import { AuthProvider } from '../../src/lib/auth/authProvider';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';
import { BrowserRouter } from 'react-router-dom';

test("dashboard home n'a pas de violations a11y majeures selon axe-core", async () => {
  const DashboardRoutes = DashboardModule.routes as React.ComponentType;

  render(
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(ConfigProvider, {
        initialConfig: testClientConfig,
        children: React.createElement(
          AuthProvider,
          null,
          React.createElement(DashboardRoutes, null)
        ),
      })
    )
  );

  const results = (await new Promise((resolve, reject) => {
    axe.run(
      document,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      }
    );
  })) as axe.AxeResults;

  // On considère ici que la page Dashboard doit être exempte
  // de violations WCAG 2.1 de sévérité serious/critical,
  // à l'exception de certaines règles non pertinentes en environnement jsdom
  // (ex: titre de document, attribut lang au niveau <html>).
  const seriousViolations = results.violations.filter((violation) => {
    if (['document-title', 'html-has-lang'].includes(violation.id)) {
      return false;
    }
    return ['serious', 'critical'].includes(violation.impact || '');
  });

  if (seriousViolations.length > 0) {
    // Fournit un log détaillé pour faciliter le debug en cas d'échec.

    console.error('[a11y] Violations dashboard:', seriousViolations);
  }

  expect(seriousViolations).toHaveLength(0);
});

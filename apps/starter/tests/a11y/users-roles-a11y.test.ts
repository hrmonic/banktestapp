import { test, expect } from 'vitest';
import axe from 'axe-core';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsersRolesModule from '../../src/modules/users-roles/module';
import { AuthProvider } from '../../src/lib/auth/authProvider';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

test("users-roles module n'a pas de violations a11y majeures selon axe-core", async () => {
  const UsersRolesRoutes = UsersRolesModule.routes as React.ComponentType;

  render(
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(ConfigProvider, {
        initialConfig: testClientConfig,
        children: React.createElement(
          AuthProvider,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/',
              element: React.createElement(UsersRolesRoutes, null),
            })
          )
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

  const seriousViolations = results.violations.filter((violation) => {
    if (['document-title', 'html-has-lang'].includes(violation.id)) {
      return false;
    }
    return ['serious', 'critical'].includes(violation.impact || '');
  });

  if (seriousViolations.length > 0) {
    console.error('[a11y] Violations users-roles:', seriousViolations);
  }

  expect(seriousViolations).toHaveLength(0);
});

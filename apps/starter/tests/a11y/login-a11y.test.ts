import { test, expect } from 'vitest';
import axe from 'axe-core';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/lib/auth/authProvider';
import LoginPage from '../../src/pages/LoginPage';

test("login page n'a pas de violations a11y majeures selon axe-core", async () => {
  render(
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(LoginPage, null)
      )
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
    console.error('[a11y] Violations login:', seriousViolations);
  }

  expect(seriousViolations).toHaveLength(0);
});

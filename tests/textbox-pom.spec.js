import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/TextBoxPage.js';

test('usar Page Object Model', async ({ page }) => {
  const textBoxPage = new TextBoxPage(page);
  
  await textBoxPage.goto();
  await textBoxPage.fillForm(
    'María García',
    'maria@test.com',
    'Madrid, España',
    'Valencia, España'
  );
  await textBoxPage.submit();
  
  const output = await textBoxPage.getOutputText();
  expect(output).toContain('María García');
  expect(output).toContain('maria@test.com');
});
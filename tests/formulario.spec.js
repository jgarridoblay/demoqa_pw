import { test, expect } from '@playwright/test';
import { assert } from 'console';
import { verifyResultsDisplay } from '../pages/TestUtils.js';

test.describe('Pruebas de DemoQA', () => {
  
  test('Rellenar formulario de contacto', async ({ page }) => {
    // Paso 1: Navegar a la página
    await page.goto('https://demoqa.com/text-box');
    
    // Paso 2: Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Text Box');
    
    // Paso 3: Llenar el formulario
    await page.fill('#userName', 'Juan Pérez');
    await page.fill('#userEmail', 'juan@ejemplo.com');
    await page.fill('#currentAddress', 'Calle Falsa 123, Madrid');
    await page.fill('#permanentAddress', 'Avenida Principal 456, Barcelona');
    
    // Paso 4: Enviar formulario
    await page.click('#submit');
    
    // Paso 5: Verificar resultados
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#name')).toContainText('Juan Pérez');
    await expect(page.locator('#email')).toContainText('juan@ejemplo.com');
  });

    test('Seleccionar CheckBox', async ({ page }) => {
    // Paso 1: Navegar a la página
    await page.goto('https://demoqa.com/text-box');
    
    // Paso 2: Verificar que estamos en la página correcta
    //await assert.expect(page.locator('h1')).toContainText('Text Box');
    await expect(page.locator('h1')).toContainText('Text Box');
    await page.getByText('Check Box').click();
    await expect(page.locator('h1')).toContainText('Check Box');
    
    // Paso 3: Seleccionar expandible y checkbox
    await page.locator('.rct-icon-expand-all').click();
    await page.locator('.rct-title', { hasText: 'Commands' }).click();
    await page.locator('.rct-title', { hasText: 'Angular' }).click();
    await page.locator('.rct-title', { hasText: 'Downloads' }).click();
    
    // Paso 4: Verificar resultados
    await verifyResultsDisplay(page, ['commands', 'angular', 'downloads', 'wordFile', 'excelFile']);
  });

    test('Seleccionar Radio Button', async ({ page }) => {
    // Paso 1: Navegar a la página
    await page.goto('https://demoqa.com/text-box');
    
    // Paso 2: Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Text Box');
    await page.getByText('Radio Button').click();
    await expect(page.locator('h1')).toContainText('Radio Button');
    
    // Paso 3: Seleccionar Radio Button
    //await page.setJavaScriptEnabled(false);
    //await page.waitForSelector('#impressiveRadio', { state: 'visible' });
    //await page.check('#impressiveRadio');
    //await page.setJavaScriptEnabled(true);
    
    // Paso 4: Verificar resultados
    //await verifyResultsDisplay(page, ['Impressive']);

    // Paso 5: Seleccionar Radio Button
    //await page.waitForSelector('#yesRadio', { state: 'visible' });
    await page.check('#yesRadio', { force: true });
    await page.check('#yesRadio');
    
    // Paso 6: Verificar resultados
    await verifyResultsDisplay(page, ['Yes']);
  });

});



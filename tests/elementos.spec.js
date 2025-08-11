import { test, expect } from '@playwright/test';

test.describe('Interacciones con Elementos', () => {
  
  test('trabajar con checkboxes y botones', async ({ page }) => {
    // Navegar a la página de elementos
    await page.goto('https://demoqa.com/checkbox');
    
    // Expandir todos los elementos del árbol
    await page.click('button[title="Expand all"]');
    
    // Seleccionar algunos checkboxes
    await page.check('label[for="tree-node-desktop"] .rct-checkbox');
    await page.check('label[for="tree-node-documents"] .rct-checkbox');
    
    // Verificar que se seleccionaron
    await expect(page.locator('#result')).toContainText('desktop');
    await expect(page.locator('#result')).toContainText('documents');
  });

  test('trabajar con dropdown', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    
    // Seleccionar opción en dropdown
    await page.click('#withOptGroup');
    await page.click('text=Group 1, option 1');
    
    // Verificar selección
    await expect(page.locator('#withOptGroup')).toContainText('Group 1, option 1');
  });

});
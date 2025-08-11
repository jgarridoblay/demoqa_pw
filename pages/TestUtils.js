import { expect } from '@playwright/test';

export async function verifyResultsDisplay(page, expectedItems) {
    
    const text = await page.locator('#text-success').allTextContents();
    // Verificar que contiene los elementos esperados
    console.info('Esperado: ', JSON.stringify(expectedItems));
    console.info('Resultado: ', JSON.stringify(text));
    console.log('¿Coinciden?', JSON.stringify(text) === JSON.stringify(expectedItems));
    // Verificar cada item seleccionado
    for (const item of expectedItems) {
      console.info('Información:', text);
      await expect(page.locator('#text-success')).toContainText(item);
    }
    
    // Verificar que hay exactamente la cantidad correcta de elementos
    await expect(page.locator('#text-success')).toHaveCount(expectedItems.length);
}
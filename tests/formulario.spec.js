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
    await page.waitForSelector('#impressiveRadio', { state: 'visible' });
    await page.check('#impressiveRadio', { force: true });
    
    // Paso 4: Verificar resultados
    await verifyResultsDisplay(page, ['Impressive']);

    // Paso 5: Seleccionar Radio Button
    await page.waitForSelector('#yesRadio', { state: 'visible' });
    await page.check('#yesRadio', { force: true });
    //await page.check('#yesRadio');
    
    // Paso 6: Verificar resultados
    await verifyResultsDisplay(page, ['Yes']);
  });

  test('Seleccionar Tablas', async ({ page }) => {
    // Paso 1: Navegar a la página
    await page.goto('https://demoqa.com/text-box');
    
    // Paso 2: Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Text Box');
    await page.getByText('Web Tables').click()
    await expect(page.locator('h1')).toContainText('Web Tables');
    
    // Paso 3: Añadir elemento
    await page.waitForSelector('#addNewRecordButton', { state: 'visible' });
    await page.locator('#addNewRecordButton').click();
    await page.waitForSelector('#firstName', { state: 'visible' });
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#userEmail', 'juan@ejemplo.com');
    await page.fill('#age', '99');
    await page.fill('#salary', '50000');
    await page.fill('#department', 'Logistic');
    await page.locator('#submit').click();

    // Paso 4: Verificar resultados
    await page.waitForSelector('.rt-table');
    // Obtener todas las filas (excepto encabezados)
    const filas = page.locator('.rt-tbody .rt-tr');
    // Contador de coincidencias
    let encontrada = false;
    // Recorrer filas
    const totalFilas = await filas.count();
    for (let i = 0; i < totalFilas; i++) {
      const fila = filas.nth(i);
      const apellido = await fila.locator('.rt-td').nth(1).innerText(); // Columna 2 = Last Name
      const salario = await fila.locator('.rt-td').nth(4).innerText(); // Columna 5 = Salary
    
      if (apellido.trim() === 'Pérez' && salario.trim() === '50000') {
        encontrada = true;
        break;
      }
    }
    // Verificar
    expect(encontrada).toBeTruthy();

    // Paso 5: Search Box
    await page.fill('#searchBox', 'juan@ejemplo.com');
    await page.locator('#basic-addon2').click();
    let filasRellenas = 0;

    for (let i = 0; i < totalFilas; i++) {
      const fila = filas.nth(i);
      const textoFila = (await fila.innerText()).trim();
    
      // Contar si tiene algún contenido real
      if (textoFila && !textoFila.includes('\u00A0')) {
        filasRellenas++;
      }
    }
    expect(filasRellenas).toBe(1);

    // Paso 6: Eliminar Dato
    await page.$eval('.rt-table', el => {
      el.scrollLeft = el.scrollWidth;
    });
    // Localizar la fila con Pérez
    const filaNueva = page.locator('.rt-tr', { hasText: 'Pérez' });

    // Hacer click en el botón Delete dentro de esa fila
    await filaNueva.locator('[title="Delete"]').click();

    filasRellenas = 0;

    for (let i = 0; i < totalFilas; i++) {
      const fila = filas.nth(i);
      const textoFila = (await fila.innerText()).trim();
    
      // Contar si tiene algún contenido real
      if (textoFila && !textoFila.includes('\u00A0')) {
        filasRellenas++;
      }
    }
    expect(filasRellenas).toBe(0);
  });

});



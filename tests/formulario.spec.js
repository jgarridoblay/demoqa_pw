import { test, expect } from '@playwright/test';
import { assert } from 'console';
import { verifyResultsDisplay } from '../pages/TestUtils.js';
import path from 'path';
import fs from 'fs';

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

  test('Comprobar Imagen', async ({ page }) => {
    // Paso 1: Navegar a la página
    await page.goto('https://demoqa.com/text-box');
    
    // Paso 2: Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Text Box');
    await page.getByText('Broken Links - Images').click();
    await expect(page.locator('h1')).toContainText('Broken Links - Images');
    
    // Paso 3: Verificar resultados
    // Esperar a que haya imágenes en la página
    await page.waitForSelector('img');
      
    const imagenesInfo = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.getAttribute('src'),
        completa: img.complete,
        naturalWidth: img.naturalWidth,
        rota: !img.complete || img.naturalWidth === 0
      }))
    );
    
    // Mostrar resultados en consola
    console.log('📷 Estado de las imágenes:');
    imagenesInfo.forEach((img, index) => {
      if (img.rota) {
        console.log(`❌ Imagen rota [${index}]: ${img.src}`);
      } else {
        console.log(`✅ Imagen OK   [${index}]: ${img.src}`);
      }
    });

  });

  test('Test completo: Upload y Download en secuencia', async ({ page, context }) => {
        await page.goto('https://demoqa.com/upload-download');
        
        // ========== PARTE 1: UPLOAD ==========
        console.log('=== INICIANDO UPLOAD ===');

        // Sube archivo de prueba
        const filePath = path.resolve(__dirname, 'file.png');
        const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          page.click('#uploadFile')
        ]);
        await fileChooser.setFiles(filePath);

        // 3. Verificar que etiqueta aparece con el nombre del archivo subido
        const fileSizeName = page.locator('#uploadedFilePath');
        await expect(fileSizeName).toContainText('file.png');
        
        // Verificar upload
        await page.waitForSelector('#uploadedFilePath', { state: 'visible' });
        const uploadedPath = await page.locator('#uploadedFilePath').textContent();
        console.log('✅ Upload completado:', uploadedPath);
        
        // ========== PARTE 2: DOWNLOAD ==========
        console.log('=== INICIANDO DOWNLOAD ===');
        
        // Configurar y ejecutar descarga usando context
        const downloadPromise = context.waitForEvent('download');
        const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/file.png') && res.status() === 200),
        page.click('#downloadButton')
      ]);

        const download = await downloadPromise;
        
        // Guardar archivo descargado
        const downloadPath = path.join(__dirname, 'downloads', 'downloaded-' + download.suggestedFilename());
        const downloadDir = path.dirname(downloadPath);
        
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }
        
        await download.saveAs(downloadPath);
        console.log('✅ Download completado:', downloadPath);
        
        // ========== VERIFICACIONES FINALES ==========
        // Verificar que ambos archivos existen
        expect(fs.existsSync(uploadFilePath)).toBeTruthy();
        expect(fs.existsSync(downloadPath)).toBeTruthy();
        
        // Comparar tamaños
        const uploadSize = fs.statSync(uploadFilePath).size;
        const downloadSize = fs.statSync(downloadPath).size;
        
        console.log('📊 Estadísticas:');
        console.log('   - Archivo subido:', uploadSize, 'bytes');
        console.log('   - Archivo descargado:', downloadSize, 'bytes');
        
        // Limpiar archivos
        [uploadFilePath, downloadPath].forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('🧹 Eliminado:', path.basename(filePath));
            }
        });
        
        console.log('✅ Test completo finalizado exitosamente');
    });

test('Dynamic Properties', async ({ page }) => {
  // Ir a la página
  await page.goto('https://demoqa.com/dynamic-properties');

  // --- 1. Esperar a que el botón cambie de color ---
  const colorChangeButton = page.locator('#colorChange');
  
  // Guardar el color inicial
  const initialColor = await colorChangeButton.evaluate(el => getComputedStyle(el).color);

  // Esperar hasta que el color sea distinto
  await expect.poll(async () => {
    return await colorChangeButton.evaluate(el => getComputedStyle(el).color);
  }).not.toBe(initialColor);

  // --- 2. Esperar a que el botón "Visible After 5 Seconds" aparezca ---
  const visibleAfterButton = page.locator('#visibleAfter');
  await visibleAfterButton.waitFor({ state: 'visible' });

  // Validar que está visible
  await expect(visibleAfterButton).toBeVisible();
});


});



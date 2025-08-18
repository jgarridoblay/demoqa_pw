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

  test('Alerts', async ({ page }) => {
    await page.goto('https://demoqa.com/alerts');

    // 1. Alerta inmediata
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
    });
    await page.click('#alertButton');

    // 2. Alerta con retardo
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'), // Espera a que aparezca el diálogo
      page.click('#timerAlertButton'), // Dispara la alerta con retardo
    ]);

    expect(dialog.message()).toBe('This alert appeared after 5 seconds');
    await dialog.accept();

    // 3. Confirm box
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you confirm action?');
      await dialog.accept();
    });
    await page.click('#confirmButton');
    await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');

    // 4. Prompt box
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name');
      await dialog.accept('Playwright Tester');
    });
    await page.click('#promtButton');
    await expect(page.locator('#promptResult')).toHaveText('You entered Playwright Tester');
  });

  test('Date picker', async ({ page }) => {
    await page.goto('https://demoqa.com/date-picker');

    // --- 1. Seleccionar solo fecha ---
    const dateInput = page.locator('#datePickerMonthYearInput');

    // Escribir la fecha en formato MM/DD/YYYY
    const fecha = '05/21/2025';
    await dateInput.fill(fecha);
    await dateInput.press('Enter');

    // Verificar valor
    await expect(dateInput).toHaveValue(fecha);

    // --- 2. Seleccionar fecha y hora ---
    const dateTimeInput = page.locator('#dateAndTimePickerInput');

    // Escribir fecha y hora en formato "Month DD, YYYY hh:mm AM/PM"
    const fechaHora = 'August 14, 2025 8:30 AM';
    await dateTimeInput.fill(fechaHora);
    await dateTimeInput.press('Enter');

    // Verificar valor
    const actualValue = await dateTimeInput.inputValue();
    console.log('Valor real en el input:', actualValue);
    console.log('Valor a comparar      :', fechaHora);
    await expect(dateTimeInput).toHaveValue(fechaHora);
  });

  test('Slider', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  // Seleccionamos el slider real por clase
  const slider = page.locator('input.range-slider');
  const valueDisplay = page.locator('#sliderValue');

  // Esperar a que el slider esté visible
  await slider.waitFor({ state: 'visible', timeout: 10000 });

  // Leer boundingBox
  const box = await slider.boundingBox();
  if (!box) throw new Error('No se pudo obtener boundingBox del slider');

  const { x, y, width, height } = box;
  const centerY = y + height / 2;

  // Calcular posiciones
  const pos26 = x + (width * 26 / 100);
  const pos62 = x + (width * (62 - 1) / 100);

  // Mover a 26
  await slider.fill('26');
  await slider.press('Enter');
  await expect(valueDisplay).toHaveValue('26');

  // Mover a 62
  await page.mouse.move(pos62, centerY);
  await page.mouse.down();
  await page.mouse.up();
  await expect(valueDisplay).toHaveValue('62');
});

test('Progress Bar', async ({ page }) => {
  await page.goto('https://demoqa.com/progress-bar');

  const startButton = page.locator('#startStopButton');
  const progressBar = page.locator('div[role="progressbar"]');

  // Iniciar la barra
  await startButton.click();

  // Esperar hasta que el valor alcance 49
  let valor = 0;
  while (valor < 49) {
    const attr = await progressBar.getAttribute('aria-valuenow');
    valor = parseInt(attr ?? '0', 10);
    await new Promise(r => setTimeout(r, 100)); // pausa 0.1s
  }

  // Detener la barra
  await startButton.click();
  console.log('Barra detenida en:', valor);

});


test('Modificar todas las opciones del select menu correctamente', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');

  // -----------------------------
  // 1. Select clásico
  // -----------------------------
  const oldSelect = page.locator('#oldSelectMenu');
  await oldSelect.selectOption('2'); // Blue
  await expect(oldSelect).toHaveValue('2');

  // -----------------------------
  // 2. React-select (Select One)
  // -----------------------------
  const selectOne = page.locator('.css-1hwfws3', { hasText: 'Select Option' });
  await selectOne.click();
  const optionSelectOne = page.getByText('Group 2, option 1', { exact: true });
  await optionSelectOne.click();
  const selectedValueOne = page.locator('#withOptGroup .css-1uccc91-singleValue');
  await expect(selectedValueOne).toHaveText('Group 2, option 1', { timeout: 5000 });

  // -----------------------------
  // 3. React-select (Select Title)
  // -----------------------------
  const selectTitle = page.locator('.css-1hwfws3', { hasText: 'Select Title' });
  await selectTitle.click();
  const optionSelectTitle = page.getByText('Mrs.', { exact: true });
  await optionSelectTitle.click();
  const selectedValueTitle = page.locator('#selectOne .css-1uccc91-singleValue');
  await expect(selectedValueTitle).toHaveText('Mrs.', { timeout: 5000 });

  // -----------------------------
  // 4. React-select multi-select (Cars)
  // -----------------------------
  const multiSelect = page.locator('.css-yk16xz-control', { hasText: 'Select...' });
  await multiSelect.click();


  // Seleccionar las opciones
  const optionGreen = page.getByText('Green', { exact: true });
  const optionBlue = page.getByText('Blue', { exact: true });
  await optionGreen.nth(1).click();
  await optionBlue.nth(1).click();

  // Validar que cada opción aparece como seleccionada
  const selectedVolvo = page.locator('.css-1rhbuit-multiValue').filter({ hasText: 'Green' });
  const selectedSaab = page.locator('.css-1rhbuit-multiValue').filter({ hasText: 'Blue' });
  await expect(selectedVolvo).toHaveCount(1);
  await expect(selectedSaab).toHaveCount(1);
});

test('Mover elementos', async ({ page }) => {
  await page.goto('https://demoqa.com/sortable');

  // Localizamos el elemento "Two" y el que actualmente está en la quinta posición ("Five")
  const itemTwo = page.locator('div#demo-tabpane-list div.list-group-item', { hasText: 'Two' });
  const itemFive = page.locator('div#demo-tabpane-list div.list-group-item', { hasText: 'Five' });

  // Arrastrar "Two" hasta la posición de "Five"
  await itemTwo.dragTo(itemFive);

  // Validar que "Two" ahora es el quinto elemento
  const items = page.locator('div#demo-tabpane-list div.list-group-item');
  await expect(items.nth(4)).toHaveText('Two'); // posición 4 = quinto elemento (0-index)
});

test('Arrastrar la caja "Drag me" dentro de "Drop here"', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable');

  // Localizadores de los elementos
  const dragMe = page.locator('#draggable');
  const dropHere = page.locator('#droppable').nth(0);

  // Acción: arrastrar y soltar
  await dragMe.dragTo(dropHere);

  // Validar que el texto del drop cambia a "Dropped!"
  await expect(dropHere).toHaveText('Dropped!');
});

});



import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import AlertPage from '../pageobjects/alert.page.js';
import GuineaPigPage from '../pageobjects/guineapig.page.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === EXISTING: Original Login Test (DO NOT MODIFY) ===
describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await (await LoginPage.loginBtn).click();
        await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');
        await expect(AlertPage.messageAlert).toHaveText(expect.stringContaining(
            'You are logged in!'));
    });
});

// === NEW: DDT JSON ===
describe('DDT - JSON: Form Submission', () => {
    interface LoginData { username: string; expectedToast: string }
    const filePath = path.join(__dirname, '../data/loginData.json');
    const data: LoginData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    data.forEach((row) => {
        it(`Submit form con nombre: "${row.username}" → toast: "${row.expectedToast}"`, async () => {
            await GuineaPigPage.open();
            await GuineaPigPage.setName(row.username);
            await GuineaPigPage.clickSubmit();

            await browser.waitUntil(
                () => GuineaPigPage.toast.isDisplayed(),
                { timeout: 5000, timeoutMsg: 'Toast no apareció tras submit' }
            );

            await expect(GuineaPigPage.toast).toHaveText(
                row.expectedToast,
                { message: `Toast esperado: "${row.expectedToast}"` }
            );
        });
    });
});

// === NEW: DDT CSV (simplified approach with manual parsing) ===
describe('DDT - CSV: Button Navigation', () => {
    interface ButtonData { buttonText: string; expectedUrl: string }
    
    // Load and parse CSV synchronously at describe time
    const filePath = path.join(__dirname, '../data/buttonsData.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    const buttonData: ButtonData[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        return {
            buttonText: values[0],
            expectedUrl: values[1]
        };
    });

    buttonData.forEach((row: ButtonData) => {
        it(`Click en "${row.buttonText}" → redirige a ${row.expectedUrl}`, async () => {
            // Arrange
            await GuineaPigPage.open();
            const link = await $(`//a[text()="${row.buttonText}"]`);

            // Act
            await link.click();

            // Assert
            await browser.waitUntil(
                async () => {
                    const url = await browser.getUrl();
                    return url.includes(row.expectedUrl);
                },
                { timeout: 10000, timeoutMsg: `No se redirigió a ${row.expectedUrl}` }
            );
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain(row.expectedUrl);
        });
    });
});

// === NEW: Patrón AAA ===
describe('Patrón AAA: Checkbox Toggle', () => {
    it('debe cambiar estado del checkbox al hacer click', async () => {
        // Arrange
        await GuineaPigPage.open();
        const checkbox = await GuineaPigPage.checkbox;

        // Act
        await checkbox.click();

        // Assert
        await expect(checkbox).toBeChecked();
    });
});

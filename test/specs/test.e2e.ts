import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import AlertPage from '../pageobjects/alert.page.js';
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
describe('DDT - JSON: Login Scenarios', () => {
    interface LoginData { 
        username: string; 
        password: string; 
        expectedMessage: string;
    }
    const filePath = path.join(__dirname, '../data/loginData.json');
    const data: LoginData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    data.forEach((row) => {
        it(`Login con usuario: "${row.username}" → mensaje: "${row.expectedMessage}"`, async () => {
            // Arrange: Navigate to login screen
            await (await LoginPage.loginBtn).click();
            
            // Act: Perform login with test data
            await LoginPage.login(row.username, row.password);
            
            // Assert: Verify success message with waitUntil
            await browser.waitUntil(
                async () => {
                    try {
                        const message = await AlertPage.messageAlert;
                        return await message.isDisplayed();
                    } catch {
                        return false;
                    }
                },
                { 
                    timeout: 5000, 
                    timeoutMsg: `Mensaje de alerta no apareció para usuario: ${row.username}` 
                }
            );

            await expect(AlertPage.messageAlert).toHaveText(
                expect.stringContaining(row.expectedMessage),
                { message: `Mensaje esperado: "${row.expectedMessage}" para usuario: ${row.username}` }
            );
        });
    });
});

// === NEW: DDT CSV ===
describe('DDT - CSV: Multiple User Login', () => {
    interface UserData { 
        username: string; 
        password: string; 
        expectedAction: string;
    }
    
    // Load and parse CSV synchronously at describe time
    const filePath = path.join(__dirname, '../data/buttonsData.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    const userData: UserData[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        return {
            username: values[0],
            password: values[1],
            expectedAction: values[2]
        };
    });

    userData.forEach((row: UserData) => {
        it(`CSV Test - Usuario: "${row.username}" → acción esperada: ${row.expectedAction}`, async () => {
            // Arrange: Navigate to login screen
            await (await LoginPage.loginBtn).click();
            
            // Act: Perform login
            await LoginPage.login(row.username, row.password);

            // Assert: Verify login was successful
            await browser.waitUntil(
                async () => {
                    try {
                        const message = await AlertPage.messageAlert;
                        return await message.isDisplayed();
                    } catch {
                        return false;
                    }
                },
                { 
                    timeout: 10000, 
                    timeoutMsg: `Login no fue exitoso para usuario: ${row.username}` 
                }
            );
            
            const alertMessage = await AlertPage.messageAlert;
            const messageText = await alertMessage.getText();
            expect(messageText).toContain('You are logged in');
        });
    });
});

// === NEW: Patrón AAA ===
describe('Patrón AAA: Login Flow', () => {
    it('debe realizar login correctamente siguiendo el patrón AAA', async () => {
        // Arrange: Preparar el escenario - navegar a la pantalla de login
        await (await LoginPage.loginBtn).click();
        
        // Verificar que los elementos están presentes antes de actuar
        await expect(LoginPage.inputUsername).toBeDisplayed();
        await expect(LoginPage.inputPassword).toBeDisplayed();
        await expect(LoginPage.btnSubmit).toBeDisplayed();

        // Act: Ejecutar la acción - realizar el login
        await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');

        // Assert: Verificar el resultado esperado
        await browser.waitUntil(
            async () => {
                try {
                    const message = await AlertPage.messageAlert;
                    return await message.isDisplayed();
                } catch {
                    return false;
                }
            },
            { 
                timeout: 5000, 
                timeoutMsg: 'Mensaje de confirmación no apareció tras el login' 
            }
        );
        
        await expect(AlertPage.messageAlert).toHaveText(
            expect.stringContaining('You are logged in!'),
            { message: 'El mensaje de confirmación no es el esperado' }
        );
    });
});


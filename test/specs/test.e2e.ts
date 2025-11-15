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
        it(`Submit form con nombre: "${row.username}" → resultado: "${row.expectedToast}"`, async () => {
            await GuineaPigPage.open();
            await GuineaPigPage.setName(row.username);
            
            // Verify the text appears in the result field as you type
            await browser.waitUntil(
                async () => {
                    const text = await GuineaPigPage.toast.getText();
                    return text.includes(row.expectedToast);
                },
                { timeout: 5000, timeoutMsg: `Texto "${row.expectedToast}" no apareció en el resultado` }
            );

            await expect(GuineaPigPage.toast).toHaveText(
                expect.stringContaining(row.expectedToast),
                { message: `Resultado esperado debe contener: "${row.expectedToast}"` }
            );
        });
    });
});

// === NEW: DDT CSV (simplified approach with manual parsing) ===
describe('DDT - CSV: Switch Toggle States', () => {
    interface SwitchData { switchAction: string; expectedState: string }
    
    // Load and parse CSV synchronously at describe time
    const filePath = path.join(__dirname, '../data/buttonsData.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    const switchData: SwitchData[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        return {
            switchAction: values[0],
            expectedState: values[1]
        };
    });

    switchData.forEach((row: SwitchData) => {
        it(`Switch action "${row.switchAction}" → estado esperado: ${row.expectedState}`, async () => {
            // Arrange
            await GuineaPigPage.open();
            
            // Get current state and toggle if needed
            const currentState = await GuineaPigPage.isSwitchActive();
            const expectedState = row.expectedState === 'true';
            
            // Act - only click if we need to change state
            if (currentState !== expectedState) {
                await GuineaPigPage.clickSwitch();
            }

            // Assert
            await browser.waitUntil(
                async () => {
                    const state = await GuineaPigPage.isSwitchActive();
                    return state === expectedState;
                },
                { timeout: 5000, timeoutMsg: `Switch no cambió al estado esperado: ${expectedState}` }
            );
            
            const finalState = await GuineaPigPage.isSwitchActive();
            expect(finalState).toBe(expectedState);
        });
    });
});

// === NEW: Patrón AAA ===
describe('Patrón AAA: Switch Toggle', () => {
    it('debe cambiar estado del switch al hacer click', async () => {
        // Arrange
        await GuineaPigPage.open();
        const initialState = await GuineaPigPage.isSwitchActive();

        // Act
        await GuineaPigPage.clickSwitch();

        // Assert
        const finalState = await GuineaPigPage.isSwitchActive();
        expect(finalState).toBe(!initialState);
    });
});

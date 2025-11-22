import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page';
import AlertPage from '../pageobjects/alert.page';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { LoginData, UserData } from '../types/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Login Scenarios', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.loginBtn.click();
        await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');
        await expect(AlertPage.messageAlert).toHaveText(expect.stringContaining('You are logged in!'));
    });

    // === AAA Pattern Example ===
    it('should login successfully following the AAA pattern', async () => {
        // Arrange: Navigate to the login screen
        await LoginPage.loginBtn.click();

        // Assert (pre-conditions): Ensure elements are present before acting
        await expect(LoginPage.inputUsername).toBeDisplayed();
        await expect(LoginPage.inputPassword).toBeDisplayed();
        await expect(LoginPage.btnSubmit).toBeDisplayed();

        // Act: Perform the login action
        await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');

        // Assert: Verify the expected result using implicit waits (no hard-coded timeouts)
        await expect(AlertPage.messageAlert).toHaveText(
            expect.stringContaining('You are logged in!'),
            { message: 'Confirmation message is not the expected one' }
        );
    });

    // === DDT JSON ===
    const jsonDataPath = path.join(__dirname, '../data/loginData.json');
    const data: LoginData[] = JSON.parse(fs.readFileSync(jsonDataPath, 'utf-8'));

    if (!data.length) throw new Error('loginData.json is empty');
    for (const row of data) {
        it(`DDT JSON - User: "${row.username}" → message: "${row.expectedMessage}"`, async () => {
            // Arrange: Navigate to the login screen
            await LoginPage.loginBtn.click();

            // Act: Perform login with data row
            await LoginPage.login(row.username, row.password);

            // Assert: Validate the message matches the expectation for this data row
            await expect(AlertPage.messageAlert).toHaveText(
                expect.stringContaining(row.expectedMessage),
                { message: `Expected message: "${row.expectedMessage}" for user: ${row.username}` }
            );
        });
    }

    // === DDT CSV ===

    // Load and parse CSV synchronously at describe time
    const csvDataPath = path.join(__dirname, '../data/buttonsData.csv');
    const csvContent = fs.readFileSync(csvDataPath, 'utf-8');
    const lines = csvContent.trim().split('\n');

    const userData: UserData[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replaceAll('"', '').trim());
        return {
            username: values[0],
            password: values[1],
            expectedAction: values[2]
        };
    });

    if (!userData.length) throw new Error('buttonsData.csv is empty');
    for (const row of userData) {
        it(`DDT CSV - User: "${row.username}" → expected action: ${row.expectedAction}`, async () => {
            // Arrange: Navigate to the login screen
            await LoginPage.loginBtn.click();

            // Act: Perform login with CSV data row
            await LoginPage.login(row.username, row.password);

            // Assert: Verify the alert contains the expected action string (demonstration value)
            await expect(AlertPage.messageAlert).toHaveText(
                expect.stringContaining(row.expectedAction)
            );
        });
    }
});


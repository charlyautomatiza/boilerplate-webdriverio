<p align="center">
  <a href="https://www.twitch.tv/charlyautomatiza"><img alt="Twitch" src="https://img.shields.io/badge/CharlyAutomatiza-Twitch-9146FF.svg" style="max-height: 300px;"></a>
  <a href="https://discord.gg/wwM9GwxmRZ"><img alt="Discord" src="https://img.shields.io/discord/944608800361570315" style="max-height: 300px;"></a>
  <a href="http://twitter.com/char_automatiza"><img src="https://img.shields.io/badge/@char__automatiza-Twitter-1DA1F2.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.youtube.com/channel/UCwEb6xrQtQCEuN_gNgi_Xfg?sub_confirmation=1"><img src="https://img.shields.io/badge/Charly%20Automatiza-Youtube-FF0000.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
  <a href="https://www.linkedin.com/in/gautocarlos/"><img src="https://img.shields.io/badge/Carlos%20 Gauto-LinkedIn-0077B5.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
</p>

<p align="center">
    <a href="https://webdriver.io/">
        <img alt="WebdriverIO" src="https://webdriver.io/assets/images/robot-3677788dd63849c56aa5cb3f332b12d5.svg" width="146">
    </a>
</p>

# Boilerplate WebdriverIO

Este repositorio contiene un boilerplate (plantilla inicial) para empezar a trabajar con [WebdriverIO](https://webdriver.io/), un framework de automatización de pruebas para navegadores web y aplicaciones móviles.

## Requisitos previos

Antes de utilizar este boilerplate, asegúrate de tener instalado Node.js en tu sistema. Puedes descargarlo e instalarlo desde [nodejs.org](https://nodejs.org/).

También te sugiero utilizar:

* La guía de mi blog [Appium v2 Android Setup Guide](https://bit.ly/appium-v2-android-setup)
* El video de setup de mi canal de youtube: [Appium v2 - WebdriverIO](https://bit.ly/3UEQbHt), es importante tener en cuenta que esto es una referencia, el setup de WDIO cambió y hay opciones que cambiaron.

## Instalación

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/charlyautomatiza/boilerplate-webdriverio.git
```

2. Navega hasta el directorio del proyecto:

```bash
cd boilerplate-webdriverio
```

3. Ejecuta el comando `npm install`:

```bash
npm install
```

## Ejecución de pruebas

Para empezar a trabajar con WebdriverIO, podrás descargar la última versión de la [Guinea Pig App](https://github.com/webdriverio/native-demo-app/releases) de WebDriverIO, tanto para usar en Android como en iOS.

Para no tener errores te sugiero que crees una carpeta llamada `app` en la raíz del proyecto y dejes [la apk de la Guinea Pig](https://github.com/webdriverio/native-demo-app/releases) en la misma.

Una vez que hayas configurado tus variables de entorno, puedes ejecutar las pruebas utilizando el siguiente comando:

```bash
npm run wdio
```

Este comando ejecutará las pruebas utilizando WebdriverIO y generará un informe de resultados.

## Para crear y abrir el reporte de Allure unificado de los resultados de los test

```bash
npm run open-report
```

## Integración continua: Ejecución automática en emulador Android (GitHub Actions)

Este proyecto incluye un workflow de GitHub Actions que automatiza la ejecución de las pruebas E2E en un emulador de Android. El workflow realiza lo siguiente:

- Descarga la APK de ejemplo (Guinea Pig App) y la coloca en la carpeta `app/`.
- Configura los permisos necesarios para el emulador en el runner de CI.
- Levanta un emulador Android (API 34, Android 14) usando la acción `reactivecircus/android-emulator-runner`.
- Instala las dependencias del proyecto (Node.js, Appium, WebdriverIO, etc).
- Ejecuta los tests E2E definidos en el proyecto.
- Publica los resultados de Allure y JUnit como artefactos del workflow.

**¿Cuándo se ejecuta este workflow?**
- Automáticamente en cada push o pull request sobre la rama `main`.

Puedes consultar el archivo del workflow en `.github/workflows/android-emulator.yml` para más detalles.

## Ejemplos Avanzados en test.e2e.ts

Este proyecto incluye ejemplos avanzados de testing que demuestran buenas prácticas y patrones de diseño comunes en automatización de pruebas, utilizando los Page Objects existentes (`LoginPage` y `AlertPage`):

### 1. Data-Driven Testing (DDT) con JSON

El archivo `test/specs/test.e2e.ts` incluye ejemplos de pruebas parametrizadas usando datos en formato JSON:

```typescript
// Cargar datos desde test/data/loginData.json
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
```

**Archivo de datos:** `test/data/loginData.json`
```json
[
  { "username": "tomsmith@mail.com", "password": "SuperSecretPassword!", "expectedMessage": "You are logged in!" },
  { "username": "user@test.com", "password": "TestPass123!", "expectedMessage": "You are logged in!" },
  { "username": "admin@example.com", "password": "Admin2024!", "expectedMessage": "You are logged in!" }
]
```

### 2. Data-Driven Testing (DDT) con CSV

También se incluyen ejemplos de pruebas usando datos en formato CSV:

```typescript
// Cargar y parsear CSV en tiempo de ejecución
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
    });
});
```

**Archivo de datos:** `test/data/buttonsData.csv`
```csv
username,password,expectedAction
user1@test.com,Pass123!,login_success
user2@test.com,Pass456!,login_success
```

### 3. Patrón AAA (Arrange-Act-Assert)

El patrón AAA organiza los tests en tres fases claramente diferenciadas:

```typescript
it('debe realizar login correctamente siguiendo el patrón AAA', async () => {
    // Arrange - Preparar el escenario de prueba
    await (await LoginPage.loginBtn).click();
    
    // Verificar que los elementos están presentes antes de actuar
    await expect(LoginPage.inputUsername).toBeDisplayed();
    await expect(LoginPage.inputPassword).toBeDisplayed();
    await expect(LoginPage.btnSubmit).toBeDisplayed();

    // Act - Ejecutar la acción a probar
    await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');

    // Assert - Verificar el resultado esperado
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
```

### 4. Buenas Prácticas Implementadas

#### Uso de waitUntil con mensajes descriptivos
```typescript
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
```

#### Mensajes claros en las aserciones
```typescript
await expect(AlertPage.messageAlert).toHaveText(
    expect.stringContaining(row.expectedMessage),
    { message: `Mensaje esperado: "${row.expectedMessage}" para usuario: ${row.username}` }
);
```

#### Page Object Model (POM)
Todas las interacciones con la aplicación se realizan a través de los Page Objects existentes `LoginPage` y `AlertPage`:

```typescript
// test/pageobjects/login.page.ts
class LoginPage {
    public get loginBtn () {
        return $('~Login');
    }

    public get inputUsername () {
        return $('~input-email');
    }

    public get inputPassword () {
        return $('~input-password');
    }

    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}
```

### Estructura de Archivos

```
test/
├── data/
│   ├── loginData.json       # Datos para DDT con JSON
│   └── buttonsData.csv      # Datos para DDT con CSV
├── pageobjects/
│   ├── login.page.ts        # Page Object de Login (existente)
│   └── alert.page.ts        # Page Object de Alert (existente)
└── specs/
    └── test.e2e.ts          # Tests E2E con ejemplos avanzados
```

### Ejecución y Reportes

Los tests generan reportes en formato Allure y JUnit que muestran:
- **3 casos de prueba** del DDT con JSON (login con diferentes usuarios)
- **2 casos de prueba** del DDT con CSV (login con datos desde CSV)
- **1 caso de prueba** con patrón AAA (login flow completo)
- **1 caso de prueba** original de login

Los reportes incluyen títulos dinámicos que facilitan la identificación de cada caso de prueba y sus datos asociados.

## Contribuir

¡Siéntete libre de contribuir a este proyecto! Si encuentras errores o tienes ideas para mejorar el boilerplate, por favor abre un issue o envía una pull request.

## Soporte

Si necesitas ayuda o tienes alguna pregunta, no dudes en abrir un issue en este repositorio. Estaremos encantados de ayudarte.

Además, puedes encontrar más información sobre WebdriverIO en la [documentación oficial](https://webdriver.io/docs/gettingstarted.html).

Para obtener más contenido y actualizaciones, visita mi [sitio web](https://charlyautomatiza.tech).

También puedes unirte a nuestro servidor de Discord para obtener soporte adicional y participar en la comunidad: [Discord Server](https://bit.ly/charlyAutomatiza-discord).

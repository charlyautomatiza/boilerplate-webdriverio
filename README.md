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

Este proyecto incluye ejemplos avanzados de testing que demuestran buenas prácticas y patrones de diseño comunes en automatización de pruebas:

### 1. Data-Driven Testing (DDT) con JSON

El archivo `test/specs/test.e2e.ts` incluye ejemplos de pruebas parametrizadas usando datos en formato JSON:

```typescript
// Cargar datos desde test/data/loginData.json
const data: LoginData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

data.forEach((row) => {
    it(`Submit form con nombre: "${row.username}" → resultado: "${row.expectedToast}"`, async () => {
        await GuineaPigPage.open();
        await GuineaPigPage.setName(row.username);
        
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
```

**Archivo de datos:** `test/data/loginData.json`
```json
[
  { "username": "Juan", "expectedToast": "Juan" },
  { "username": "Ana", "expectedToast": "Ana" },
  { "username": "Test User", "expectedToast": "Test User" }
]
```

### 2. Data-Driven Testing (DDT) con CSV

También se incluyen ejemplos de pruebas usando datos en formato CSV:

```typescript
// Cargar y parsear CSV en tiempo de ejecución
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
        // Test implementation...
    });
});
```

**Archivo de datos:** `test/data/buttonsData.csv`
```csv
switchAction,expectedState
on,true
off,false
```

### 3. Patrón AAA (Arrange-Act-Assert)

El patrón AAA organiza los tests en tres fases claramente diferenciadas:

```typescript
it('debe cambiar estado del switch al hacer click', async () => {
    // Arrange - Preparar el escenario de prueba
    await GuineaPigPage.open();
    const initialState = await GuineaPigPage.isSwitchActive();

    // Act - Ejecutar la acción a probar
    await GuineaPigPage.clickSwitch();

    // Assert - Verificar el resultado esperado
    const finalState = await GuineaPigPage.isSwitchActive();
    expect(finalState).toBe(!initialState);
});
```

### 4. Buenas Prácticas Implementadas

#### Uso de waitUntil con mensajes descriptivos
```typescript
await browser.waitUntil(
    async () => {
        const state = await GuineaPigPage.isSwitchActive();
        return state === expectedState;
    },
    { timeout: 5000, timeoutMsg: `Switch no cambió al estado esperado: ${expectedState}` }
);
```

#### Mensajes claros en las aserciones
```typescript
await expect(GuineaPigPage.toast).toHaveText(
    expect.stringContaining(row.expectedToast),
    { message: `Resultado esperado debe contener: "${row.expectedToast}"` }
);
```

#### Page Object Model (POM)
Todas las interacciones con la aplicación se realizan a través del Page Object `GuineaPigPage`, que encapsula los selectores y las acciones:

```typescript
// test/pageobjects/guineapig.page.ts
class GuineaPigPage {
    public get nameInput() {
        return $('~text-input');
    }

    public async setName(name: string) {
        await this.nameInput.setValue(name);
    }

    public async open() {
        const formsTab = await $('~Forms');
        await formsTab.click();
        await browser.pause(500);
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
│   ├── guineapig.page.ts    # Page Object de Guinea Pig Forms
│   ├── login.page.ts        # Page Object de Login
│   └── alert.page.ts        # Page Object de Alert
└── specs/
    └── test.e2e.ts          # Tests E2E con ejemplos avanzados
```

### Ejecución y Reportes

Los tests generan reportes en formato Allure y JUnit que muestran:
- **3 casos de prueba** del DDT con JSON (uno por cada conjunto de datos)
- **2 casos de prueba** del DDT con CSV (uno por cada estado del switch)
- **1 caso de prueba** con patrón AAA
- **1 caso de prueba** original de login

Los reportes incluyen títulos dinámicos que facilitan la identificación de cada caso de prueba y sus datos asociados.

## Contribuir

¡Siéntete libre de contribuir a este proyecto! Si encuentras errores o tienes ideas para mejorar el boilerplate, por favor abre un issue o envía una pull request.

## Soporte

Si necesitas ayuda o tienes alguna pregunta, no dudes en abrir un issue en este repositorio. Estaremos encantados de ayudarte.

Además, puedes encontrar más información sobre WebdriverIO en la [documentación oficial](https://webdriver.io/docs/gettingstarted.html).

Para obtener más contenido y actualizaciones, visita mi [sitio web](https://charlyautomatiza.tech).

También puedes unirte a nuestro servidor de Discord para obtener soporte adicional y participar en la comunidad: [Discord Server](https://bit.ly/charlyAutomatiza-discord).

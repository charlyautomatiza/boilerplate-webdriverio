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

## Contribuir

¡Siéntete libre de contribuir a este proyecto! Si encuentras errores o tienes ideas para mejorar el boilerplate, por favor abre un issue o envía una pull request.

## Soporte

Si necesitas ayuda o tienes alguna pregunta, no dudes en abrir un issue en este repositorio. Estaremos encantados de ayudarte.

Además, puedes encontrar más información sobre WebdriverIO en la [documentación oficial](https://webdriver.io/docs/gettingstarted.html).

Para obtener más contenido y actualizaciones, visita mi [sitio web](https://charlyautomatiza.tech).

También puedes unirte a nuestro servidor de Discord para obtener soporte adicional y participar en la comunidad: [Discord Server](https://bit.ly/charlyAutomatiza-discord).

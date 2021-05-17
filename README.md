# node-modules-assets-downloader

[![npm version](https://img.shields.io/npm/v/node-modules-assets-downloader.svg?style=flat)](https://www.npmjs.com/package/node-modules-assets-downloader) [![Test cypress](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-cypress.yml/badge.svg)](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-cypress.yml) [![Test node-sass](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-node-sass.yml/badge.svg)](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-node-sass.yml) [![Test playwright](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-playwright.yml/badge.svg)](https://github.com/Meir017/node-modules-assets-downloader/actions/workflows/test-playwright.yml)

downloads the asserts required by node_modules

## Install

```bash
npm install node-modules-assets-downloader -g
```

## Usage

```bash
download-node-modules-assets node-sass v4.9.2

download-node-modules-assets cypress 7.2.0

download-node-modules-assets playwright 1.11.0
```

## supported node_modules

- [node-sass](https://github.com/sass/node-sass)
- [cypress](https://github.com/cypress-io/cypress)
- [playwright](https://github.com/microsoft/playwright)

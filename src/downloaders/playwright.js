const { Downloader } = require("../downloader");
const util = require('util');

// copied from https://github.com/microsoft/playwright/blob/v1.11.0/src/utils/registry.ts#L107
const DOWNLOAD_URLS = {
    'chromium': {
        'ubuntu18.04': '%s/builds/chromium/%s/chromium-linux.zip',
        'ubuntu20.04': '%s/builds/chromium/%s/chromium-linux.zip',
        'mac10.13': '%s/builds/chromium/%s/chromium-mac.zip',
        'mac10.14': '%s/builds/chromium/%s/chromium-mac.zip',
        'mac10.15': '%s/builds/chromium/%s/chromium-mac.zip',
        'mac11': '%s/builds/chromium/%s/chromium-mac.zip',
        'mac11-arm64': '%s/builds/chromium/%s/chromium-mac-arm64.zip',
        'win32': '%s/builds/chromium/%s/chromium-win32.zip',
        'win64': '%s/builds/chromium/%s/chromium-win64.zip',
    },
    'firefox': {
        'ubuntu18.04': '%s/builds/firefox/%s/firefox-ubuntu-18.04.zip',
        'ubuntu20.04': '%s/builds/firefox/%s/firefox-ubuntu-20.04.zip',
        'mac10.13': '%s/builds/firefox/%s/firefox-mac-10.14.zip',
        'mac10.14': '%s/builds/firefox/%s/firefox-mac-10.14.zip',
        'mac10.15': '%s/builds/firefox/%s/firefox-mac-10.14.zip',
        'mac11': '%s/builds/firefox/%s/firefox-mac-10.14.zip',
        'mac11-arm64': '%s/builds/firefox/%s/firefox-mac-11.0-arm64.zip',
        'win32': '%s/builds/firefox/%s/firefox-win32.zip',
        'win64': '%s/builds/firefox/%s/firefox-win64.zip',
    },
    'firefox-stable': {
        'ubuntu18.04': '%s/builds/firefox-stable/%s/firefox-stable-ubuntu-18.04.zip',
        'ubuntu20.04': '%s/builds/firefox-stable/%s/firefox-stable-ubuntu-20.04.zip',
        'mac10.13': '%s/builds/firefox-stable/%s/firefox-stable-mac-10.14.zip',
        'mac10.14': '%s/builds/firefox-stable/%s/firefox-stable-mac-10.14.zip',
        'mac10.15': '%s/builds/firefox-stable/%s/firefox-stable-mac-10.14.zip',
        'mac11': '%s/builds/firefox-stable/%s/firefox-stable-mac-10.14.zip',
        'mac11-arm64': '%s/builds/firefox-stable/%s/firefox-stable-mac-11.0-arm64.zip',
        'win32': '%s/builds/firefox-stable/%s/firefox-stable-win32.zip',
        'win64': '%s/builds/firefox-stable/%s/firefox-stable-win64.zip',
    },
    'webkit': {
        'ubuntu18.04': '%s/builds/webkit/%s/webkit-ubuntu-18.04.zip',
        'ubuntu20.04': '%s/builds/webkit/%s/webkit-ubuntu-20.04.zip',
        'mac10.13': undefined,
        'mac10.14': '%s/builds/deprecated-webkit-mac-10.14/%s/deprecated-webkit-mac-10.14.zip',
        'mac10.15': '%s/builds/webkit/%s/webkit-mac-10.15.zip',
        'mac11': '%s/builds/webkit/%s/webkit-mac-10.15.zip',
        'mac11-arm64': '%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip',
        'win32': '%s/builds/webkit/%s/webkit-win64.zip',
        'win64': '%s/builds/webkit/%s/webkit-win64.zip',
    },
    'webkit-technology-preview': {
        'ubuntu18.04': '%s/builds/webkit/%s/webkit-ubuntu-18.04.zip',
        'ubuntu20.04': '%s/builds/webkit/%s/webkit-ubuntu-20.04.zip',
        'mac10.13': undefined,
        'mac10.14': undefined,
        'mac10.15': '%s/builds/webkit/%s/webkit-mac-10.15.zip',
        'mac11': '%s/builds/webkit/%s/webkit-mac-10.15.zip',
        'mac11-arm64': '%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip',
        'win32': '%s/builds/webkit/%s/webkit-win64.zip',
        'win64': '%s/builds/webkit/%s/webkit-win64.zip',
    },
    'ffmpeg': {
        'ubuntu18.04': '%s/builds/ffmpeg/%s/ffmpeg-linux.zip',
        'ubuntu20.04': '%s/builds/ffmpeg/%s/ffmpeg-linux.zip',
        'mac10.13': '%s/builds/ffmpeg/%s/ffmpeg-mac.zip',
        'mac10.14': '%s/builds/ffmpeg/%s/ffmpeg-mac.zip',
        'mac10.15': '%s/builds/ffmpeg/%s/ffmpeg-mac.zip',
        'mac11': '%s/builds/ffmpeg/%s/ffmpeg-mac.zip',
        'mac11-arm64': '%s/builds/ffmpeg/%s/ffmpeg-mac.zip',
        'win32': '%s/builds/ffmpeg/%s/ffmpeg-win32.zip',
        'win64': '%s/builds/ffmpeg/%s/ffmpeg-win64.zip',
    },
};

class PlaywrightDownloader extends Downloader {
    constructor({
        downloadsDirectory,
        downloadParallelism,
        version
    }) {
        super({ downloadsDirectory, downloadParallelism, version });
    }

    async getDownloadAssets() {
        const browsersJsonUrl = `https://raw.githubusercontent.com/microsoft/playwright/v${this.version}/browsers.json`;
        const browsersJson = await this.getJson(browsersJsonUrl);

        const browsers = {};
        browsersJson.browsers.forEach(({ name, revision }) => {
            browsers[name] = revision;
        });

        const downloadHost = 'https://playwright.azureedge.net';

        const urls = new Set();
        const assets = [];
        Object.entries(DOWNLOAD_URLS).forEach(([key, value]) => {
            Object.keys(value).forEach(platform => {
                const urlTemplate = DOWNLOAD_URLS[key][platform];
                if (!urls.has(urlTemplate) && typeof urlTemplate === 'string') {
                    urls.add(urlTemplate);
                    assets.push({
                        name: `${key}-${platform}`,
                        url: util.format(urlTemplate, downloadHost, browsers[key])
                    });
                }
            });
        });

        return assets;
    }
}

module.exports = PlaywrightDownloader;
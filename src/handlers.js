// @ts-check

const request = require('request-promise');
const fs = require('fs');
const path = require('path');

const modulesRepositoryMapping = {
    'node-sass': 'sass',
};

/**
 * @param {string} moduleName 
 * @param {string} version 
 */
async function githubReleaseHandler(moduleName, version) {

    const baseUrl = `https://api.github.com/repos/${modulesRepositoryMapping[moduleName]}/${moduleName}/releases/tags`;
    const tagUrl = `${baseUrl}/${version}`;
    const downloadsDirectory = `./${moduleName}-assets`;

    if (!fs.existsSync(downloadsDirectory)) fs.mkdirSync(downloadsDirectory);

    const release = await request(tagUrl, {
        json: true,
        headers: {
            'User-Agent': `download-${moduleName}`
        }
    });

    console.log('downloading release assets', {
        assets: release.assets.length,
        version
    });
    for (const { name, browser_download_url } of release.assets) {
        console.log('downloading asset...', { name });

        downloadFile(name, browser_download_url);
        await new Promise((res) => setTimeout(res, 1000));

        console.log('downloaded asset', { name });
    }


    async function downloadFile(filename, url) {
        const fullPath = path.join(downloadsDirectory, filename);
        if (fs.existsSync(fullPath)) {
            console.log('file already exists', { filename });
            return;
        };
        request(url, { resolveWithFullResponse: true, encoding: null })
            .pipe(fs.createWriteStream(fullPath));
    }
}

/**
 * @param {string} moduleName 
 */
function createGithubReleaseHandler(moduleName) {
    return function handler(version) {
        return githubReleaseHandler(moduleName, version);
    }
}

/**
 * @param {string} moduleName 
 */
function getHandler(moduleName) {
    switch (moduleName) {
        case 'node-sass':
            return createGithubReleaseHandler(moduleName);

        default:
            break;
    }
}


module.exports = {
    getHandler
};
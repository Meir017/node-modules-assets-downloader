// @ts-check

const request = require('request-promise');
const fs = require('fs');
const path = require('path');

const modulesRepositoryMapping = {
    'node-sass': 'sass',
};

const downloadParallelism = 8;

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
    const downloads = [];
    let i = 0;
    for (const { name, browser_download_url } of release.assets) {
        console.log('downloading asset...', { name });

        downloads.push(downloadFile(name, browser_download_url).then(() => {
            console.log('downloaded asset', { name });
        }));

        if (downloads.length % downloadParallelism === 0) {
            await Promise.all(downloads);
        }

        ++i;
    }
    await Promise.all(downloads);

    async function downloadFile(filename, url) {
        return new Promise(async (resolve, reject) => {
            const fullPath = path.join(downloadsDirectory, filename);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).size === 0) {
                console.log('empty file, deleting and retrying', { filename });
                fs.unlinkSync(fullPath);
            } else if (fs.existsSync(fullPath)) {
                console.log('file already exists', { filename });
                return;
            }
            const stream = request(url, { resolveWithFullResponse: true, encoding: null })
                .pipe(fs.createWriteStream(fullPath));
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
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
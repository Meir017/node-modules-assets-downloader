// @ts-check

const { GitHubDownloader, CypressDownloader } = require('./downloader');

const modulesRepositoryMapping = {
    'node-sass': 'sass',
};

/**
 * @param {string} moduleName 
 * @param {string} version 
 */
async function githubReleaseHandler(moduleName, version) {

    const downloadsDirectory = `./${moduleName}-assets`;

    const downloader = new GitHubDownloader({
        downloadsDirectory,
        repository: moduleName,
        username: modulesRepositoryMapping[moduleName],
        version: version,
        downloadParallelism: 8
    });

    await downloader.download();
}

/**
 * 
 * @param {string} version 
 */
async function cypressHandler(version) {
    const downloadsDirectory = `./cypress-assets`;

    const downloader = new CypressDownloader({
        downloadsDirectory,
        downloadParallelism: 8,
        version: version
    });

    await downloader.download();
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
 * @param {string} moduleVersion
 */
function getHandler(moduleName, moduleVersion) {
    switch (moduleName) {
        case 'node-sass':
            if (!moduleVersion.startsWith('v')) {
                console.error('usage: download-node-modules-assets <version>');
                process.exit(1);
            }

            return createGithubReleaseHandler(moduleName);
        case 'cypress':
            return cypressHandler;
        default:
            break;
    }
}


module.exports = {
    getHandler
};
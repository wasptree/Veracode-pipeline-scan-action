#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScan = exports.downloadJar = void 0;
const child_process_1 = require("child_process");
function downloadJar() {
    core.info('Downloading pipeline-scan.jar');
    try {
        var downloadJar = `curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip`;
        var getDownloadOutput = (0, child_process_1.execSync)(downloadJar).toString();
        core.info('pipeline-scan.jar downloaded');
    }
    catch (error) {
        core.info(`Status Code: ${error.status} with '${error.message}'`);
    }
    try {
        var unzipJar = 'unzip -o pipeline-scan-LATEST.zip';
        const getUnzipOutput = (0, child_process_1.execSync)(unzipJar).toString();
        core.info('pipeline_scan.jar unzipped');
    }
    catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        core.info("Pipeline-scan-LATEST.zip could not be unzipped.");
    }
}
exports.downloadJar = downloadJar;
function runScan(parameters) {
    console.log('start scanning');
    try {
        var scanCommand = `java -jar pipeline-scan.jar -vid ${parameters[vid]} -vkey ${parameters[vkey]} -f ` + parameters[file];
        core.info('Pipeline-scan scan command: ' + scanCommand);
        var getScanCommandOutput = (0, child_process_1.execSync)(scanCommand).toString();
        core.info(getScanCommandOutput);
    }
    catch (error) {
        core.info(`Status Code: ${error.status} with '${error.message}'`);
        core.info("pipeline-scan didn't run");
    }
}
exports.runScan = runScan;

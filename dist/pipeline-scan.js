#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScan = exports.downloadJar = void 0;
const child_process_1 = require("child_process");
function downloadJar() {
    console.log('Downloading pipeline-scan.jar');
    try {
        var downloadJar = `curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip`;
        var getDownloadOutput = (0, child_process_1.execSync)(downloadJar).toString();
        console.log('pipeline-scan.jar downloaded');
    }
    catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
    }
    try {
        var unzipJar = 'unzip -o pipeline-scan-LATEST.zip';
        const getUnzipOutput = (0, child_process_1.execSync)(unzipJar).toString();
        console.log('pipeline_scan.jar unzipped');
    }
    catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        console.error("Pipeline-scan-LATEST.zip could not be unzipped.");
    }
}
exports.downloadJar = downloadJar;
function runScan(parameters) {
    try {
        var scanCommand = `java -jar pipeline-scan.jar -vid ${parameters[vid]} -vkey ${parameters[vkey]} -f ` + parameters[file];
        console.log('Pipeline-scan scan command: ' + scanCommand);
        var getScanCommandOutput = (0, child_process_1.execSync)(scanCommand).toString();
        console.log(getScanCommandOutput);
    }
    catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        console.error("pipeline-scan didn't run");
    }
}
exports.runScan = runScan;

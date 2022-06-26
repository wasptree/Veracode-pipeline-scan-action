#!/usr/bin/env node
import { exec, execSync, spawn } from "child_process";
import { stringify } from "querystring";


export function downloadJar ()  {
    console.log('Downloading pipeline-scan.jar')
    try {
        var downloadJar = `curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip`;
        var getDownloadOutput = execSync(downloadJar).toString()
        console.log('pipeline-scan.jar downloaded')
        
    }
    catch(error){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        
    }
    
    try {
        var unzipJar = 'unzip -o pipeline-scan-LATEST.zip'
        const getUnzipOutput = execSync(unzipJar).toString();
        console.log('pipeline_scan.jar unzipped')
    }
    catch(error){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        console.error("Pipeline-scan-LATEST.zip could not be unzipped.")
    }
}

export function runScan (parameters){
    console.log('start scanning')
    try {
        var scanCommand = `java -jar pipeline-scan.jar -vid ${parameters[vid]} -vkey ${parameters[vkey]} -f `+parameters[file]
        console.log('Pipeline-scan scan command: '+scanCommand)
        var getScanCommandOutput = execSync(scanCommand).toString();
        console.log(getScanCommandOutput)
    }
    catch(error){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        console.error("pipeline-scan didn't run")
    }
}
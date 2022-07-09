#!/usr/bin/env node
import { exec, execSync, spawn } from "child_process";
import * as core from '@actions/core'
import { countReset } from "console";
import { stringify } from "querystring";
import { stdin } from "process";


export function downloadJar ()  {
    core.info('Downloading pipeline-scan.jar')
    try {
        var downloadJar = `curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip`;
        var getDownloadOutput = execSync(downloadJar).toString()
        core.info('pipeline-scan.jar downloaded')
        
    }
    catch(error){
        core.info(`Status Code: ${error.status} with '${error.message}'`);
        
    }
    
    try {
        var unzipJar = 'unzip -o pipeline-scan-LATEST.zip'
        const getUnzipOutput = execSync(unzipJar).toString();
        core.info('pipeline_scan.jar unzipped')
    }
    catch(error){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        core.info("Pipeline-scan-LATEST.zip could not be unzipped.")
    }
}

export function runScan (parameters){
    core.info('start scanning')
    core.info('with parametees: '+parameters)
    var scanCommand = 'java -jar pipeline-scan.jar -vid '+parameters[0]+' -vkey '+parameters[1]+' -f '+parameters[2]
    core.info('Pipeline-scan scan command: '+scanCommand)
  
    var spawn = require('child_process').spawn;
    var getScanCommandOutput = spawn('sh',['-c', scanCommand],{stdio:"pipe",});
    getScanCommandOutput.stdout.on('data', function (data) {   process.stdout.write(data.toString());  })

    getScanCommandOutput.on('close', (code) => {
        core.info(`Scan finished with exit code:  ${code}`);
        core.info('Finish command');
    });
}
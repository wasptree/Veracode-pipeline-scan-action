import { readFileSync, existsSync} from 'fs';
import * as core from '@actions/core'
import { downloadJar } from "./pipeline-scan";
import { runScan } from "./pipeline-scan";

const core = require('@actions/core');


// get input params
const parameters = []
const vid = core.getInput('vid', {required: true} );
parameters.push(vid)
const vkey = core.getInput('vkey', {required: true} );
parameters.push(vkey)
const file = core.getInput('file', {required: true} );
parameters.push(file)


function run (parameters){
    downloadJar()

    runScan(parameters)






}

run(parameters)
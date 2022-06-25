import { readFileSync, existsSync} from 'fs';
import * as core from '@actions/core'
import { downloadJar } from "./pipeline-scan";
import { runScan } from "./pipeline-scan";


// get input params
const vid = core.getInput('vid', {required: true} );
const vkey = core.getInput('vkey', {required: true} );
const file = core.getInput('file', {required: true} );

function run (){
    downloadJar()

    runScan(file)






}

run()
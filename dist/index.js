"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_scan_1 = require("./pipeline-scan");
const pipeline_scan_2 = require("./pipeline-scan");
const core = require('@actions/core');
// get input params
const parameters = [];
const vid = core.getInput('vid', { required: true });
parameters.push(vid);
const vkey = core.getInput('vkey', { required: true });
parameters.push(vkey);
const file = core.getInput('file', { required: true });
parameters.push(file);
function run(parameters) {
    (0, pipeline_scan_1.downloadJar)();
    (0, pipeline_scan_2.runScan)(parameters);
}
run(parameters);

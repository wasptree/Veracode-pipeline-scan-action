"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const pipeline_scan_1 = require("./pipeline-scan");
const pipeline_scan_2 = require("./pipeline-scan");
// get input params
var parameters;
const vid = core.getInput('vid', { required: true });
parameters.push(vid);
const vkey = core.getInput('vkey', { required: true });
parameters.push(vkey);
const file = core.getInput('file', { required: true });
parameters.push(file);
core.info(parameters);
function run(parameters) {
    (0, pipeline_scan_1.downloadJar)();
    (0, pipeline_scan_2.runScan)(parameters);
}
run(parameters);

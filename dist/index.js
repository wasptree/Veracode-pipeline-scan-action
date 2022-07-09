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
const check_parameters_1 = require("./check-parameters");
// get input params
let parameters = {};
//var parameters:string[] = new Array()
const vid = core.getInput('vid', { required: true });
//parameters.push(vid)
parameters['vid'] = vid;
const vkey = core.getInput('vkey', { required: true });
//parameters.push(vkey)
parameters['vkey'] = vkey;
const file = core.getInput('file', { required: true });
//parameters.push(file)
parameters['file'] = file;
const type = core.getInput('type', { required: true });
//parameters.push(type)
parameters['type'] = type;
const request_policy = core.getInput('request_policy', { required: false });
//parameters.push(request_policy)
parameters['request_policy'] = request_policy;
const fail_on_severity = core.getInput('fail_on_severity', { required: false });
//parameters.push(fail_on_severity)
parameters['fail_on_severity'] = fail_on_severity;
const fail_on_cwe = core.getInput('fail_on_cwe', { required: false });
//parameters.push(fail_on_cwe)
parameters['fail_on_cwe'] = fail_on_cwe;
const baseline_file = core.getInput('baseline_file', { required: false });
//parameters.push(baseline_file)
parameters['baseline_file'] = baseline_file;
const policy_name = core.getInput('policy_name', { required: false });
//parameters.push(policy_name)
parameters['policy_name'] = policy_name;
const policy_file = core.getInput('policy_file', { required: false });
//parameters.push(policy_file)
parameters['policy_file'] = policy_file;
const timeout = core.getInput('timeout', { required: false });
//parameters.push(timeout)
parameters['timeout'] = timeout;
const issue_details = core.getInput('issue_details', { required: false });
//parameters.push(file)
parameters['issue_details'] = issue_details;
const summary_display = core.getInput('summary_display', { required: false });
//parameters.push(summary_display)
parameters['summary_display'] = summary_display;
const json_display = core.getInput('json_display', { required: false });
//parameters.push(json_display)
parameters['json_display'] = json_display;
const verbose = core.getInput('verbose', { required: false });
//parameters.push(verbose)
parameters['verbose'] = verbose;
const summary_output = core.getInput('summary_output', { required: false });
//parameters.push(summary_output)
parameters['summary_output'] = summary_output;
const summary_output_file = core.getInput('summary_output_file', { required: false });
//parameters.push(summary_output_file)
parameters['summary_output_file'] = summary_output_file;
const json_output = core.getInput('json_output', { required: false });
//parameters.push(json_output)
parameters['json_output'] = json_output;
const json_output_file = core.getInput('json_output_file', { required: false });
//parameters.push(json_output_file)
parameters['json_output_file'] = json_output_file;
const filtered_json_output_file = core.getInput('filtered_json_output_file', { required: false });
//parameters.push(filtered_json_output_file)
parameters['filtered_json_output_file'] = filtered_json_output_file;
const project_name = core.getInput('project_name', { required: false });
//parameters.push(project_name)
parameters['project_name'] = project_name;
const project_url = core.getInput('project_url', { required: false });
//parameters.push(project_url)
parameters['project_url'] = project_url;
const project_ref = core.getInput('project_ref', { required: false });
//parameters.push(project_ref)
parameters['fiproject_refle'] = project_ref;
const app_id = core.getInput('app_id', { required: false });
//parameters.push(app_id)
parameters['app_id'] = app_id;
const development_stage = core.getInput('development_stage', { required: false });
//parameters.push(development_stage)
parameters['development_stage'] = development_stage;
core.info(parameters);
function run(parameters) {
    (0, check_parameters_1.checkParameters)(parameters);
    //downloadJar()
    //runScan(parameters)
}
run(parameters);

import { readFileSync, existsSync} from 'fs';
import * as core from '@actions/core'
import { downloadJar } from "./pipeline-scan";
import { runScan } from "./pipeline-scan";
import { checkParameters } from './check-parameters';

// get input params
let parameters = {}

const vid = core.getInput('vid', {required: true} );
parameters['vid'] = vid

const vkey = core.getInput('vkey', {required: true} );
parameters['vkey'] = vkey

const file = core.getInput('file', {required: true} );
parameters['file'] = file

const run_method = core.getInput('run_method', {required: true} );
parameters['run_method'] = run_method

const request_policy = core.getInput('request_policy', {required: false} );
parameters['request_policy'] = request_policy

const fail_on_severity = core.getInput('fail_on_severity', {required: false} );
parameters['fail_on_severity'] = fail_on_severity

const fail_on_cwe = core.getInput('fail_on_cwe', {required: false} );
parameters['fail_on_cwe'] = fail_on_cwe

const baseline_file = core.getInput('baseline_file', {required: false} );
parameters['baseline_file'] = baseline_file

const policy_name = core.getInput('policy_name', {required: false} );
parameters['policy_name'] = policy_name

const policy_file = core.getInput('policy_file', {required: false} );
parameters['policy_file'] = policy_file

const timeout = core.getInput('timeout', {required: false} );
parameters['timeout'] = timeout

const issue_details = core.getInput('issue_details', {required: false} );
parameters['issue_details'] = issue_details

const summary_display = core.getInput('summary_display', {required: false} );
parameters['summary_display'] = summary_display

const json_display = core.getInput('json_display', {required: false} );
parameters['json_display'] = json_display

const verbose = core.getInput('verbose', {required: false} );
parameters['verbose'] = verbose

const summary_output = core.getInput('summary_output', {required: false} );
parameters['summary_output'] = summary_output

const summary_output_file = core.getInput('summary_output_file', {required: false} );
parameters['summary_output_file'] = summary_output_file

const json_output = core.getInput('json_output', {required: false} );
parameters['json_output'] = json_output

const json_output_file = core.getInput('json_output_file', {required: false} );
parameters['json_output_file'] = json_output_file

const filtered_json_output_file = core.getInput('filtered_json_output_file', {required: false} );
parameters['filtered_json_output_file'] = filtered_json_output_file

const project_name = core.getInput('project_name', {required: false} );
parameters['project_name'] = project_name

const project_url = core.getInput('project_url', {required: false} );
parameters['project_url'] = project_url

const project_ref = core.getInput('project_ref', {required: false} );
parameters['fiproject_refle'] = project_ref

const app_id = core.getInput('app_id', {required: false} );
parameters['app_id'] = app_id

const development_stage = core.getInput('development_stage', {required: false} );
parameters['development_stage'] = development_stage



async function run (parameters){
    //downloadJar()
    await checkParameters(parameters)
    core.info('Scan command to run: '+scanCommand)
    //runScan(parameters)

}

run(parameters)
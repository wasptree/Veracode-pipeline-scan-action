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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParameters = void 0;
const core = __importStar(require("@actions/core"));
const pipeline_scan_1 = require("./pipeline-scan");
function checkParameters(parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(JSON.stringify(parameters));
        let scanCommand = 'java -jar pipeline-scan.jar ' + parameters.vid + ' -vkey ' + parameters.vkey;
        let policyCommand = "";
        if (parameters.run_method == "runScan") {
            core.info('simple run stage');
            if (parameters.request_policy != "") {
                core.info('Policy file download required');
                policyCommand = 'java -jar pipeline-scan.jar -vid ' + parameters.vid + ' -vkey ' + parameters.vkey + ' --request_policy "' + parameters.request_policy + '"';
                core.info('Policy Download command: ' + policyCommand);
                const policyDownloadOutput = yield (0, pipeline_scan_1.runScan)(policyCommand);
                core.info('Policy Downlaod Output: ' + policyDownloadOutput);
                var policyFileName = parameters.request_policy.replace(/ /gi, "_");
                core.info('Policy Filen Name: ' + policyFileName);
                scanCommand += " --policy_file " + policyFileName;
            }
            core.info('create pipeline-scan scan command');
            Object.entries(parameters).forEach(([key, value], index) => {
                if (key != 'vid' && key != 'vkey' && key != 'run_method' && key != 'request_policy' && value != "") {
                    scanCommand += " --" + key + " " + value;
                    core.info(scanCommand);
                }
            });
        }
        else if (parameters.run_method == "storeBaseline") {
            core.info('baseline file stage');
        }
        return scanCommand;
    });
}
exports.checkParameters = checkParameters;

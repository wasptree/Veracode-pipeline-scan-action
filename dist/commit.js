#!/usr/bin/env node
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
exports.commitBasline = void 0;
const child_process_1 = require("child_process");
const core = __importStar(require("@actions/core"));
function commitBasline(parameters) {
    if (parameters.store_baseline_file_branch == "" || parameters.create_baseline_from == "") {
        core.info('To store a baseline file you need to set the parameters "store_baseline_file_branch" and "create_baseline_from" in order to work correctly');
    }
    else {
        core.info('Creating git command to push file');
        let baselineFileName = "";
        if (parameters.create_baseline_from == "standard") {
            baselineFileName = "results.json";
        }
        else if (parameters.create_baseline_from == "filtered") {
            baselineFileName = "filtered_results.json";
        }
        let gitCommand = `git config --global user.name "${env.CI_COMMIT_AUTHOR}"
                            git config --global user.email "username@users.noreply.github.com"
                            git pull
                            git add -f "${baselineFileName}"
                            git commit -a -m "Veracode Baseline File push from pipeline"
                            git push origin HEAD:"${parameters.store_baseline_file_branch}"
                            `;
        core.info('Git Command: ' + gitCommand);
        if (parameters.debug == 1) {
            core.info('---- DEBUG OUTPUT START ----');
            core.info('---- commit.ts / commitBasline() ----');
            core.info('Git Command: ' + gitCommand);
            core.info('---- DEBUG OUTPUT END ----');
        }
        let commandOutput = '';
        try {
            (0, child_process_1.execSync)(gitCommand);
        }
        catch (ex) {
            commandOutput = ex.stdout.toString();
        }
        return commandOutput;
    }
}
exports.commitBasline = commitBasline;

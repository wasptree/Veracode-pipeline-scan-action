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
exports.checkParameters = void 0;
const core = __importStar(require("@actions/core"));
function checkParameters(parameters) {
    core.info(JSON.stringify(parameters));
    if (parameters.run_method == "runScan") {
        core.info('simple run stage');
        let command = "";
        Object.entries(parameters).forEach(([key, value], index) => {
            core.info(key, value, index);
            if (key != 'vid' || key != 'vkey' || key != 'run_method') {
                command += " --" + key + " " + value;
                core.info(command);
            }
        });
    }
    else if (parameters.run_method == "storeBaseline") {
        core.info('baseline file stage');
    }
}
exports.checkParameters = checkParameters;

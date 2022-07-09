import * as core from '@actions/core'
import { runScan } from './pipeline-scan'

export function checkParameters (parameters)  {
    core.info(JSON.stringify(parameters))

    if ( parameters.run_method == "runScan" ){
        core.info('simple run stage')
        let scanCommand:string = 'java -jar '+parameters.vid+' -vkey '+parameters.vkey
        let policyCommand:string = ""

        if ( parameters.request_policy != ""){
            core.info('Policy file download required')
            policyCommand = 'java -jar -vid '+parameters.vid+' -vkey '+parameters.vkey+' --request_policy "'+parameters.request_policy+'"'
            core.info('Policy Download command: '+policyCommand)
            runScan(policyCommand)
        }
        

        Object.entries(parameters).forEach(([key, value], index) => {
            core.info(key, value, index);
            if ( key != 'vid' && key != 'vkey' && key != 'run_method' && key != 'request_policy' && value != "") {
                scanCommand += " --"+key+" "+value  
                core.info(scanCommand)
            }
        });

    }
    else if ( parameters.run_method == "storeBaseline" ) {
        core.info('baseline file stage')

    }


}


import * as core from '@actions/core'
import { type } from 'os'

export function checkParameters (parameters)  {
    core.info(JSON.stringify(parameters))

    if ( parameters.run_method == "runScan" ){
        core.info('simple run stage')
        let command:string = ""
        
        if ( parameters.request_policy != ""){
            core.info('Policy file download required')
            command = 'java -jar -vid '+parameters.vid+' -vkey '+vkey+' --request_policy "'+parameters.request_policy+'"'
            core.info('Policy Download command: '+command)
        }
        

        Object.entries(parameters).forEach(([key, value], index) => {
            core.info(key, value, index);
            if ( key != 'vid' && key != 'vkey' && key != 'run_method' && key != 'request_policy') {
                command += " --"+key+" "+value  
                core.info(command)
            }
        });

    }
    else if ( parameters.run_method == "storeBaseline" ) {
        core.info('baseline file stage')

    }


}


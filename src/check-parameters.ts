import * as core from '@actions/core'
import { type } from 'os'

export function checkParameters (parameters)  {
    core.info(JSON.stringify(parameters))

    if ( parameters.run_method == "runScan" ){
        core.info('simple run stage')
        let command:string

        Object.entries(parameters).forEach(([key, value], index) => {
            core.info(key, value, index);
            command += "--"+key+" "+value
            core.info(command)
        });

    }
    else if ( parameters.run_method == "storeBaseline" ) {
        core.info('baseline file stage')

    }


}


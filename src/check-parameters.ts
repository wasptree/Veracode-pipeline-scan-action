import * as core from '@actions/core'
import { type } from 'os'

export function checkParameters (parameters)  {
    core.info(JSON.stringify(parameters))

    if ( parameters.run_type == "runScan" ){
        core.info('run stage')

    }
    else if ( parameters.run_type == "storeBaseline" ) {
        core.info('baseline file stage')

    }


}


import * as core from '@actions/core'
import { type } from 'os'

export function checkParameters ()  {
    core.info(parameters)

    if ( parameters.type == "runScan" ){
        core.info('run stage')

    }
    else if ( parameters.type == "storeBaseline" ) {
        core.info('baseline file stage')

    }


}


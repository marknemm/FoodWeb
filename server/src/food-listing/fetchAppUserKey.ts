'use strict'
export function fetchAppUserKey(sessionObject): number {

    if (sessionObject.appUserKey != null) {
        return sessionObject.appUserKey
    }
    else return -1;
}
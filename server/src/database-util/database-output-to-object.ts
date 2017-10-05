let postgresArray = require('postgres-array');

// TODO: Match flattened database object with encapsulated children of shared object.


/**
 * Copies each database output property's value that is specified in a given object to that object.
 * In simpler terms, copies all data in the database output to a shared object.
 * If the database object's format is different than the camel-case of the shared object, then it tries to match
 * each property despite the format differences (e.g. all lowercase database output and camel-case shared object).
 * @param databaseOutput The database output object that we shall copy from.
 * @param sharedObject The shared object that we shall copy to.
 * @param sharedObjectName The name of the shared object. Can be used for debugging output purposes.
 */
export function copyDatabaseOutputToObject(databaseOutput: any, object: any, sharedObjectName: string = ''): void {
    
    for (let sharedObjectProperty in object) {

        // Skip over object properties that are inherited from Object.
        if (!object.hasOwnProperty(sharedObjectProperty))  continue;

        let databaseOutputProperty: string = matchSharedAndDatabaseProperties(sharedObjectProperty, databaseOutput, sharedObjectName);
        
        // If the shared object property was matched with a database output object property.
        if (databaseOutputProperty !== null) {

            // WARNING: This assumes there are only arrays in output and no JSONB members.
            // TODO: Differentiate between Postgres array and JSONB outputs here!
            const databasePropertyIsArr = (databaseOutput[databaseOutputProperty] != null && databaseOutput[databaseOutputProperty][0] === '{');
            object[sharedObjectProperty] = databasePropertyIsArr ? postgresArray.parse(databaseOutput[databaseOutputProperty])
                                                                 : databaseOutput[databaseOutputProperty];
        }
    }
}


/**
 * Attempts to match a shared object property with a database output object property. If there is not a direct match,
 * it attempts to alter the format of the shared object property to find a close match (such as letter-case differences).
 * NOTE: Displays a warning in the console whenever a property match cannot be found!
 * @param sharedObjectProperty The shared object property.
 * @param databaseOutput The database output object.
 * @param sharedObjectName The name of the shared object. Can be used for debugging output purposes.
 * @return The matched database output property.
 *         NOTE: If none is found, then null is returned.
 */
function matchSharedAndDatabaseProperties(sharedObjectProperty: string, databaseOutput: any, sharedObjectName: string): string {

    let databaseOutputProperty: string = sharedObjectProperty;

    /* If the property in shared targetObj is not found in database output, then provide warning via console.
       The shared object is what drives movement of data from server to front end, so it is alright if
       we have data in the database output that is not in the shared object, because it may be meant only for the server! */
    if (databaseOutput[databaseOutputProperty] === undefined) {

        // Try to see if there is a lowercase version of the property if no direct match found.
        databaseOutputProperty = sharedObjectProperty.toLowerCase();
        
        if (databaseOutput[databaseOutputProperty] === undefined) {
            console.error('WARNING: Property ' + sharedObjectProperty + ' is in shared object ' + sharedObjectName + ', but is not in database output');
            databaseOutputProperty = null;
        }
    }

    return databaseOutputProperty;
}

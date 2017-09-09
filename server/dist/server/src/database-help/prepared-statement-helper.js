"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes all null entries in an argument list to a parameterized SQL prepared statement to prevent errors.
 * @param queryStr The query string with parameters in it.
 * @param queryArgs The arguments to a parameterized SQL prepared statement. All null entries will be removed.
 * @return The resulting queryStr with all paraemters corresponding to null arguments replaced with null literals.
 */
function fixNullQueryArgs(queryStr, queryArgs) {
    var replaceSearch;
    var replaceVal;
    for (var i = 0; i < queryArgs.length; i++) {
        if (queryArgs[i] == null) {
            // Replace the argument in the query string with null
            replaceSearch = '$' + (i + 1).toString();
            replaceVal = 'null';
            queryStr = queryStr.replace(replaceSearch, replaceVal);
            // Set all other higher $<j> parameters in query string to be $<j - 1>
            for (var j = i + 1; j < queryArgs.length; j++) {
                replaceSearch = '$' + (j + 1).toString();
                replaceVal = '$' + (j).toString();
                queryStr = queryStr.replace(replaceSearch, replaceVal);
            }
            // Finally remove argument from queryArgs
            queryArgs.splice(i, 1);
            i = i - 1;
        }
    }
    return queryStr;
}
exports.fixNullQueryArgs = fixNullQueryArgs;
/**
 * Converts a given JavaScript array to a PGSQL array (in string format).
 * @param jsArr The JavaScript array.
 * @return The PGSQL array (in string format). Returns null if the given jsArr is null or empty.
 */
function toPostgresArray(jsArr) {
    var postgresArrStr = null;
    if (jsArr != null && jsArr.length > 0) {
        postgresArrStr = '{ ';
        for (var i = 0; i < jsArr.length; i++) {
            postgresArrStr += jsArr[i] + ', ';
        }
        postgresArrStr = postgresArrStr.substr(0, postgresArrStr.length - 2) + " }";
    }
    return postgresArrStr;
}
exports.toPostgresArray = toPostgresArray;
//# sourceMappingURL=prepared-statement-helper.js.map
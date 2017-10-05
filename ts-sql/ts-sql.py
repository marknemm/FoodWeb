#!/usr/bin/python
import os.path
import sys
import tsSqlParser


def checkCommandLineArg():
    '''
    Checks for valid command line arguments. Exits with error message if invalid.
    '''

    if len(sys.argv) < 2:
        print('ERROR: ts-sql file name (& path) required as command line argument')
        exit(1)

    sqlScriptFileName = sys.argv[1]
    if (not os.path.isfile(sqlScriptFileName)):
        print('Error: Invalid file name provided')
        exit(1)


def extractTsSqlScript(sqlScriptFileName):
    '''
    Extracts the ts-sql portion of the sql script.

    INPUT(S) --
    sqlScriptFileName: The file name of the sql script to extract the ts-sql portion from.

    RETURN--
    The textual representation of the ts-sql portion of the sql script.
    '''

    BEGIN_SYMBOL = '-- @'
    END_SYMBOL = ';'

    inTsSqlScript = False
    tsSqlScript = ''

    print('INFO: Extracting ts-sql script from: "' + sqlScriptFileName + '"')
    with open(sqlScriptFileName) as sqlScriptFile:
        for sqlScriptLine in sqlScriptFile:

            inTsSqlScript = inTsSqlScript or (BEGIN_SYMBOL in sqlScriptLine)

            if inTsSqlScript:
                tsSqlScript += sqlScriptLine
                inTsSqlScript = (END_SYMBOL not in sqlScriptLine)

    if (tsSqlScript == ''):
        print('ERROR: No ts-sql meta-language syntax found in: "' +
              sqlScriptFileName + '"')
        exit(1)

    print('INFO: Extracted ts-sql script:\n')
    print(tsSqlScript)

    return tsSqlScript


checkCommandLineArg()
tsSqlScript = extractTsSqlScript(sys.argv[1])
tsSqlParser.parseTsSqlScript(tsSqlScript)
# executeProgram(tsSqlParseTree)

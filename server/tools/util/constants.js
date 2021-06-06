const path = require('path');

// Setup global path vars.
global['rootDir']             = path.join(__dirname, '..', '..', '..');
global['serverDir']           = path.join(global['rootDir'], 'server');
global['serverToolsDir']      = path.join(global['serverDir'], 'tools');
global['databaseToolsDir']    = path.join(global['serverToolsDir'], 'database');
global['databaseToolsJsDir']  = path.join(global['databaseToolsDir'], 'js');
global['sqlDumpDir']          = path.join(global['databaseToolsDir'], 'dump');
global['sqlScriptsDir']       = path.join(global['databaseToolsDir'], 'sql');
global['serverProjectsDir']   = path.join(global['serverDir'], 'projects');
global['serverWebDir']        = path.join(global['serverProjectsDir'], 'web');
global['serverDistDir']       = path.join(global['serverDir'], 'dist');
global['serverTemplatesDir']  = path.join(global['serverDir'], 'templates');

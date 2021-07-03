const path = require('path');

// Setup global path vars.
global['rootDir']             = path.join(__dirname, '..', '..', '..');
global['clientDir']           = path.join(global['rootDir'], 'client');
global['clientToolsDir']      = path.join(global['clientDir'], 'tools');
global['clientProjectsDir']   = path.join(global['clientDir'], 'projects');
global['clientWebDir']        = path.join(global['clientProjectsDir'], 'web');
global['clientDistDir']       = path.join(global['clientDir'], 'dist');

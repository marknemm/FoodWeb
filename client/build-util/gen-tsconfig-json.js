const fs = require('fs');
const path = require('path');

genProjectTsconfigJSON('web');
genProjectTsconfigJSON('app');
genProjectTsconfigJSON('admin');

function genProjectTsconfigJSON(project) {
  const projectRoot = path.join(__dirname, '..', 'projects', project);
  const tsconfigAppJsPathname = path.join(projectRoot, 'tsconfig.js');
  const tsconfigSpecJsPathname = path.join(projectRoot, 'tsconfig.spec.js');
  (fs.existsSync(tsconfigAppJsPathname))
    ? jsToJSON(tsconfigAppJsPathname)
    : console.log(`Skipping generation of JSON from '${tsconfigAppJsPathname}' since JS src does not exist.`);
  (fs.existsSync(tsconfigSpecJsPathname))
    ? jsToJSON(tsconfigSpecJsPathname)
    : console.log(`Skipping generation of JSON from '${tsconfigSpecJsPathname}' since JS src does not exist.`);
}

function jsToJSON(jsPathname) {
  const jsonObj = require(jsPathname);
  const jsonPathname = jsPathname.replace('.js', '.json');
  fs.writeFileSync(jsonPathname, JSON.stringify(jsonObj, undefined, 2));
}

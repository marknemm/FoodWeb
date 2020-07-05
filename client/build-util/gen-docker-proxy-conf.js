const fs = require('fs');
const path = require('path');

genDockerProxyConfJSON('web');
genDockerProxyConfJSON('admin');

function genDockerProxyConfJSON(project) {
  const projectRoot = path.join(__dirname, '..', 'projects', project);
  const proxyConfJSONPathname = path.join(projectRoot, 'proxy.conf.json');
  if (fs.existsSync(proxyConfJSONPathname)) {
    const dockerProxyConfJSONPathname = proxyConfJSONPathname.replace('proxy.conf.json', 'docker-proxy.conf.json');
    const proxyConfJSONObj = require(proxyConfJSONPathname);
    const dockerServerHost = project === 'admin' ? 'foodweb-admin-server' : 'foodweb-server';
    proxyConfJSONObj['/server/*'].pathRewrite['^/server'] = proxyConfJSONObj['/server/*'].pathRewrite['^/server'].replace('localhost', dockerServerHost);
    fs.writeFileSync(dockerProxyConfJSONPathname, JSON.stringify(proxyConfJSONObj, undefined, 2));
  } else {
    console.log(`Skipping generation of docker config for '${proxyConfJSONPathname}' since JS src does not exist.`);
  }
}

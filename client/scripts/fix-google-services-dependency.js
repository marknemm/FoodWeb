#!/usr/bin/env node

const fs = require('fs');

module.exports = function(context) {
  const file = './platforms/android/cordova-support-google-services/foodweb-build.gradle';
  if (fs.existsSync(file)) {
    const from = "classpath 'com.android.tools.build:gradle:+'";
    const to = "classpath 'com.android.tools.build:gradle:3.5.1'";
    let fileContent = fs.readFileSync(file).toString();
    fileContent = fileContent.replace(from, to);
    fs.writeFileSync(file, fileContent, { encoding: 'utf8' });
    console.log('Replaced ', from, 'with', to, 'in', file);
  }
}

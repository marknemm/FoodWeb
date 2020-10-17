import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.foodweb',
  main: 'main.js',
  appPath: 'projects/app/src',
  appResourcesPath: 'App_Resources',
  webpackConfigPath: 'webpack.config.js',
  ios: {
    discardUncaughtJsExceptions: true
  },
  android: {
    discardUncaughtJsExceptions: true,
    v8Flags: '--nolazy --expose_gc',
    markingMode: 'none',
    suppressCallJSMethodExceptions: false
  }
} as NativeScriptConfig;

// Copy this file to 'environment.device.ts' and update server to include the IP address of your local machine.
// You can obtain your Wireless LAN adapter Wi-Fi IP address on windows via command line 'ipconfig'.
// This environment may be used for dev testing of code that has been deployed to your Android/iOS device.

export const environment: FoodWebAppEnvironment = {
  production: false,
  qa: false,
  demo: false,
  e2e: false,
  hmr: false,
  mobile: true,
  offline: false,
  supportEmail: 'support@wnyfoodweb.com',
  recaptchaSiteKey: '',
  googleMapsJSApiKey: 'AIzaSyDQdydkED1Z-nZvQXQQHlOYXnrmdqdFedA',
  server: 'http://192.168.1.11:5000/server'
};

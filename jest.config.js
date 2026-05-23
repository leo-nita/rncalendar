module.exports = {
  preset: 'react-native',
  // Points to the setup file in your root folder
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    // Force Jest to transform ESM packages that ship untranspiled module syntax
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-firebase|@react-navigation|react-native-screens|react-native-safe-area-context)',
  ],
};

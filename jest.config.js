module.exports = {
  preset: 'react-native',
  // Points to the setup file in your root folder
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    // This regex pattern forces Jest to process both react-native and react-native-firebase files
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-firebase)',
  ],
};

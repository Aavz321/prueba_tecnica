export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

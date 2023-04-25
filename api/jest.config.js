const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  displayName: 'api',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  "testRegex": ".*\\.spec\\.ts$",
  "modulePaths": ["<rootDir>/src", "<rootDir>/src/"],
  // 'moduleNameMapper' important to map some 'paths' from tsconfig.json for jest.
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } ),
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: '../coverage/api',
  coverageReporters: [
    "text",
    "lcov",
    "cobertura"
  ],
  testResultsProcessor: "jest-sonar-reporter",
  testEnvironment: "node"
};

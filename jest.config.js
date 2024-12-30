module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: [
    'api/**/*.js',
  ],
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest.setup.js'],
  verbose: true,
};
  
  
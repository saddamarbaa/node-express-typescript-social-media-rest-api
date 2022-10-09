module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
};

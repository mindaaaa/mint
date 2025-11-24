/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@core/(.*)\\.js$': '<rootDir>/src/core/$1.ts',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@app/(.*)\\.js$': '<rootDir>/src/app/$1.ts',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@test/(.*)\\.js$': '<rootDir>/src/__test__/$1.ts',
    '^@test/(.*)$': '<rootDir>/src/__test__/$1',
    '^@web/(.*)\\.js$': '<rootDir>/src/app/transport/web/$1.ts',
    '^@web/(.*)$': '<rootDir>/src/app/transport/web/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};

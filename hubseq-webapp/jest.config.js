// Jest configuration for the HubSeq demo.
//
// Uses `next/jest` so tests transform JSX/ESM the same way Next.js does and
// pick up the project's module resolution (baseUrl = src).
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  // Default to jsdom; backend tests opt into node via a per-file docblock.
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customConfig);

import 'dotenv/config';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
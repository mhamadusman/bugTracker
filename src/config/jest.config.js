require('dotenv').config();

module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
 setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};
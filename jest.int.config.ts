
import { createRequire } from 'node:module'
import { pathsToModuleNameMapper } from 'ts-jest'

const require = createRequire(import.meta.url)
const { compilerOptions } = require('./tsconfig.json')

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],

  preset: 'ts-jest/presets/default-esm',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  testRegex: '.*\\.int-spec\\.ts$',

  testEnvironment: 'node',
}

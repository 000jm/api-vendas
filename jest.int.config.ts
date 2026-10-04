import { createRequire } from 'node:module'
import { pathsToModuleNameMapper } from 'ts-jest'

const nodeRequire = createRequire(__filename)
const { compilerOptions } = nodeRequire('./tsconfig.json')

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],

  preset: 'ts-jest/presets/default-esm',

  extensionsToTreatAsEsm: ['.ts'],

  globals: {
    'ts-jest': {
      useESM: true,
    },
  },

  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },

  testRegex: '.*\\.int-spec\\.ts$',

  testEnvironment: 'node',
}
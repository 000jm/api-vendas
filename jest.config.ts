
import { pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json' with { type: 'json' }

const { compilerOptions } = tsconfig

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/'
    }),
    testRegex: '.*\\.spec\\.ts$',
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    collectCoverageFrom: ['**/*.(j|t)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node'
}

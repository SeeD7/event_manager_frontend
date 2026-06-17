module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  
  // On regroupe tout ici. On dit à Jest : "Transforme ces modules même s'ils sont dans node_modules"
  transformIgnorePatterns: [
    'node_modules/(?!@angular|@testing-library|ngx-toastr|rxjs)'
  ],

  transform: {
    // On laisse jest-preset-angular tout gérer (TS, JS, et ESM)
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
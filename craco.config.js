// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      public: path.resolve(__dirname, 'public/'),
    },
  },
  jest: {
    configure: (jestConfig, {}) => {
      jestConfig.collectCoverage = true
      jestConfig.collectCoverageFrom = ['src/stores/**/*.{js,ts}', '!src/stores/store.ts']
      jestConfig.coveragePathIgnorePatterns = []
      return jestConfig
    },
  },
}

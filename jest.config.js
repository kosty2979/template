module.exports = {
  'verbose': true,
  'snapshotSerializers': ['enzyme-to-json/serializer'],
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|scss|less)$': '<rootDir>/node_modules/jest-css-modules'
  },
  'moduleNameMapper': {
    '~(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/no-unstable-nested-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
};

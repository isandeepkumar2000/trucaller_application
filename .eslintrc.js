module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'prettier',
    'prettier/react',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
  },
};

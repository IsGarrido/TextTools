module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'new-cap': 0,
    'max-len': ['error', {'code': 200, 'tabWidth': 4}],
    'linebreak-style': 0,
  },
};

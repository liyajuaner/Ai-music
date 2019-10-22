/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 08:04:12
 * @LastEditTime: 2019-08-27 20:42:46
 * @LastEditors: Please set LastEditors
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

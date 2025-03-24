module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    eqeqeq: 0, // 必须全等于
    '@typescript-eslint/no-unused-expressions': 0, // 表达式的写法 true&&xxx
    '@typescript-eslint/no-explicit-any': 0, //any类型
    '@typescript-eslint/no-use-before-define': 0, // 在使用定义之前使用的，可以禁用，如函数
    'array-callback-return': 0, // map需要一个函数返回值
    'no-param-reassign': 0, // 参数能否被赋值
    '@typescript-eslint/no-this-alias': 0, // 函数内this全局
    'max-lines': ['error', { max: 600 }],
    '@typescript-eslint/no-unused-vars': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};

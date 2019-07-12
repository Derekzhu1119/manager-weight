var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT:'"https://app.derekzhu.site"',
  API_ROOT:'"https://st.yango.com.cn"',
  API_LANG:'"cn"',
  API_DEV: '"development"'
})

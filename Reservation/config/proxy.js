/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/reservation': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
      pathRewrite: {
        '^/api/reservation': '/SE/back',
      },
    },
    '/api/management': {
      target: 'http://124.220.171.17:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/management': '/api',
      },
    },
    '/api/pharmacy': {
      target: 'http://124.220.171.17:6666',
      changeOrigin: true,
      pathRewrite: {
        '^/api/pharmacy': '/doctor_interface',
      },
    },
  },
  test: {
    '/api/reservation': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
      pathRewrite: {
        '^/api/reservation': '/SE/back',
      },
    },
  },
  pre: {
    '/api/reservation': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^/api/reservation': '/SE/back',
      },
    },
  },
};

import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Max Dog',
  },
  plugins: ['@umijs/max-plugin-openapi'],
  routes: [
    {
      path: '/',
      redirect: '/assistant',
    },
    {
      name: '智能助手',
      path: '/assistant',
      component: './Assistant',
      layout: false,
    },

  ],
  proxy: {
    '/api': {
      target: 'http://localhost:3456',
      changeOrigin: true,
    },
  },
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'http://localhost:3456/docs-json',
      mock: false,
      projectName: 'configure',
    },
  ],
  npmClient: 'pnpm',
});

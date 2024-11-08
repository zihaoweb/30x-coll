import type { ProxyOptions } from 'vite';
import { API_BASE_URL, API_BASE_URL1, API_TARGET_URL, API_TARGET_URL1, MOCK_API_BASE_URL, MOCK_API_TARGET_URL } from '../constant';

type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  [API_BASE_URL]: {
    target: API_TARGET_URL,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${API_BASE_URL}`), ''),
  },
  [API_BASE_URL1]: {
    target: API_TARGET_URL1,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${API_BASE_URL1}`), ''),
  },
  // mock
  [MOCK_API_BASE_URL]: {
    target: MOCK_API_TARGET_URL,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${MOCK_API_BASE_URL}`), '/api'),
  },

};

export default init;

import axios from 'axios';
import constants from '@/constants';
import _ from 'lodash';
import store from '@/store/store.js';

const tokenType = 'Bearer';
const groupPath =  'touchcast-internal';

const apiBase = axios.create({
  baseURL: 'https://fabric-api.touchcast.io',
});

apiBase.interceptors.request.use(function(config) {
  const state = store.getState();

  const authToken = state.token.access_token;

  config.headers['Authorization'] =
    tokenType + ' ' + authToken;
  config.params = config.params || {};

  if (config.data) {
    config.data['group'] = groupPath;
  }

  if (config.method === 'get') {
    _.forOwn(config.params, (value, key) => {
      config.params[key] = value;
    });
    //config.params['group'] = getAuthGroupPath(state);
  }

  _.forEach(constants.apiAdditionalParams, item => {
    config.params[item.name] = item.value;
  });

  return config;
}, error => {
  return Promise.reject(error);
});

apiBase.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error);
});

export default apiBase;

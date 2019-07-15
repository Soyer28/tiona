import axios from 'axios';
import * as AppConfig from '../../app.config';

export class RestError extends Error {
  constructor(response) {
    super();
    this.name = 'RestError';
    this.stack = (new Error()).stack;
    this.status = response.status;
    if (response.data && response.data.code && response.data.message) {
      this.code = response.data.code;
      this.message = response.data.message;
      if (response.data.parameter) {
        this.parameter = response.data.parameter;
      }
    } else {
      this.code = response.status;
      this.message = response.statusText;
    }
  }
}

export const configure = () => {
  axios.defaults.baseURL = AppConfig.API_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-newForm-urlencoded;charset=UTF-8';
  axios.interceptors.response.use(
    response => response.data,
    error => {
      throw new RestError(error.response);
    }
  );
};

export const auth = ({username, password}) => {
  axios.defaults.auth = {
    username,
    password
  };
};

export const client = axios;

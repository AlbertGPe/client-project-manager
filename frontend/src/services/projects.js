import http from './base-api';

const list = () => http.get('/projects')
  .then((res) => res.data)

export default {
  list
}
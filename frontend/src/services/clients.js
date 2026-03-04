import http from './base-api';

const list = () => http.get('/clients')
  .then((res) => res.data)

export default {
  list
}